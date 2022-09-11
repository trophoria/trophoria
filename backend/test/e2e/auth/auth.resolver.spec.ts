import { JwtService } from '@nestjs/jwt';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { TestingModule } from '@nestjs/testing';
import { JwtPayload } from '@trophoria/libs/common';
import { ApiConfigService } from '@trophoria/modules/_setup/config/api-config.service';

import { PrismaService } from '@trophoria/modules/_setup/prisma/prisma.service';
import {
  meQuery,
  refreshQuery,
  signInQuery,
  signOutQuery,
  signUpQuery,
} from '@trophoria/test/e2e/auth/auth.queries';
import {
  gqlData,
  gqlErrors,
  graphql,
  parseCookies,
  setupE2eTest,
} from '@trophoria/test/e2e/e2e-utils';
import { UserMock } from '@trophoria/test/mocks/user.mock';

jest.mock('@sendgrid/mail', () => {
  return {
    setApiKey: jest.fn(),
    send: jest.fn(() => ({ statusCode: 200, message: 'email sent' })),
  };
});

describe('AuthResolver (e2e)', () => {
  let app: NestFastifyApplication;
  let db: PrismaService;
  let config: ApiConfigService;
  let jwt: JwtService;
  let module: TestingModule;

  beforeAll(async () => {
    ({ app, db, config, module } = await setupE2eTest());
    jwt = module.get<JwtService>(JwtService);
  });

  afterAll(() => app.close());

  describe('qql signUp (mutation)', () => {
    beforeAll(() => db.cleanDatabase());

    it('should sign up without username', async () => {
      const variables = { userInput: UserMock.userWithoutUsername };

      const { createdAt, email, payload, updatedAt, username, isVerified } =
        gqlData(
          await graphql(app, signUpQuery, variables).expect(200),
          'signUp',
        );

      expect(new Date(createdAt)).toBeValidDate();
      expect(new Date(updatedAt)).toBeValidDate();
      expect(username).toMatch(/unameduser\d{5}/);
      expect(email).toBe(variables.userInput.email);
      expect(payload).toBeNull();
      expect(isVerified).toBeFalse();
    });

    it('should return an error if email exists', async () => {
      const variables = { userInput: UserMock.userWithoutUsername };

      const errors = gqlErrors(
        await graphql(app, signUpQuery, variables).expect(409),
      );

      expect(errors[0].message).toBe('user already exists');
    });
  });

  describe('gql signIn (mutation)', () => {
    let payload: JwtPayload;

    beforeAll(async () => {
      await db.cleanDatabase();
      const variables = { userInput: UserMock.userWithoutUsername };
      await graphql(app, signUpQuery, variables);
    });

    it('should create token pair if credentials correct', async () => {
      const variables = { credentials: UserMock.userWithoutUsername };

      const res = await graphql(app, signInQuery, variables).expect(200);
      const { accessToken, refreshToken } = gqlData(res, 'signIn');
      const cookies = parseCookies(res);

      payload = jwt.decode(accessToken) as JwtPayload;

      expect(cookies['REFRESH']).toMatch(refreshToken);
      expect(accessToken).toMatch(/^[^.]*\.[^.]*\.[^.]*$/);
      expect(refreshToken).toMatch(/^[^.]*\.[^.]*\.[^.]*$/);
    });

    it('should throw error if credentials do not match', async () => {
      const variables = { credentials: { email: 'wrong', password: 'wrong' } };

      const errors = gqlErrors(
        await graphql(app, signInQuery, variables).expect(401),
      );

      expect(errors[0].message).toBe('invalid credentials');
    });

    it('should detect token reuse', async () => {
      const variables = { credentials: UserMock.userWithoutUsername };

      const reusedToken = jwt.sign(
        { id: payload.id },
        {
          subject: payload.id,
          privateKey: config.get<string>('JWT_REFRESH_PRIVATE_KEY'),
          expiresIn: config.get<string>('JWT_REFRESH_EXPIRES_IN'),
          jwtid: '42',
        },
      );

      const res = await graphql(app, signInQuery, variables, [
        `REFRESH=${reusedToken}`,
      ]).expect(200);
      const { reuseDetected } = gqlData(res, 'signIn');

      expect(reuseDetected).toBeTrue();
    });
  });

  describe('gql refreshTokens (mutation)', () => {
    let signRefreshToken: string;

    beforeAll(async () => {
      await db.cleanDatabase();
      const variables = { userInput: UserMock.userWithoutUsername };
      await graphql(app, signUpQuery, variables);
      signRefreshToken = gqlData(
        await graphql(app, signInQuery, {
          credentials: UserMock.userWithoutUsername,
        }),
        'signIn',
      ).refreshToken;
    });

    it('should create new token pair if refresh token valid', async () => {
      const res = await graphql(app, refreshQuery, null, [
        `REFRESH=${signRefreshToken}`,
      ]).expect(200);

      const { accessToken, refreshToken } = gqlData(res, 'refreshTokens');
      const cookies = parseCookies(res);

      expect(cookies['REFRESH']).toMatch(refreshToken);
      expect(accessToken).toMatch(/^[^.]*\.[^.]*\.[^.]*$/);
      expect(refreshToken).toMatch(/^[^.]*\.[^.]*\.[^.]*$/);
    });

    it('should throw error if no refresh token cookie provided', async () => {
      const errors = gqlErrors(await graphql(app, refreshQuery).expect(401));
      expect(errors[0].message).toBe('invalid refresh token');
    });
  });

  describe('gql me (query)', () => {
    let accessToken: string;

    beforeAll(async () => {
      await db.cleanDatabase();
      const variables = { userInput: UserMock.userWithoutUsername };
      await graphql(app, signUpQuery, variables);
      accessToken = gqlData(
        await graphql(app, signInQuery, {
          credentials: UserMock.userWithoutUsername,
        }),
        'signIn',
      ).accessToken;
    });

    it('should return user object if access token is valid', async () => {
      const { createdAt, email, payload, updatedAt, username, isVerified } =
        gqlData(
          await graphql(app, meQuery)
            .set('authorization', `Bearer ${accessToken}`)
            .expect(200),
          'me',
        );

      expect(new Date(createdAt)).toBeValidDate();
      expect(new Date(updatedAt)).toBeValidDate();
      expect(username).toMatch(/unameduser\d{5}/);
      expect(email).toBe(UserMock.userWithoutUsername.email);
      expect(payload).toBeNull();
      expect(isVerified).toBeFalse();
    });

    it('should return an error if access token is invalid', async () => {
      const errors = gqlErrors(await graphql(app, meQuery).expect(401));
      expect(errors[0].message).toBe('Unauthorized');
    });
  });

  describe('gql signOut (mutation)', () => {
    let accessToken: string;
    let refreshToken: string;

    beforeAll(async () => {
      await db.cleanDatabase();
      const variables = { userInput: UserMock.userWithoutUsername };
      await graphql(app, signUpQuery, variables), 'signUp';
      ({ accessToken, refreshToken } = gqlData(
        await graphql(app, signInQuery, {
          credentials: UserMock.userWithoutUsername,
        }),
        'signIn',
      ));
    });

    it('should return success message', async () => {
      const { statusCode, message } = gqlData(
        await graphql(app, signOutQuery)
          .set('authorization', `Bearer ${accessToken}`)
          .expect(200),
        'signOut',
      );

      expect(statusCode).toBe(200);
      expect(message).toBe('successfully signed out');
    });

    it('should detect token reuse if refresh token is used again', async () => {
      await graphql(app, refreshQuery, null, [
        `REFRESH=${refreshToken}`,
      ]).expect(403);
    });
  });
});
