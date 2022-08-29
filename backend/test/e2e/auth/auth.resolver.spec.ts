import { NestFastifyApplication } from '@nestjs/platform-fastify';

import { PrismaService } from '@trophoria/modules/_setup/prisma/prisma.service';
import {
  signInQuery,
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

describe('AuthResolver (e2e)', () => {
  let app: NestFastifyApplication;
  let db: PrismaService;

  beforeAll(async () => ({ app, db } = await setupE2eTest()));
  afterAll(() => app.close());

  describe('qql sign_up (mutation)', () => {
    beforeAll(() => db.cleanDatabase());

    it('should sign up without username', async () => {
      const variables = { user_input: UserMock.userWithoutUsername };

      const { createdAt, email, payload, updatedAt, username, isVerified } =
        gqlData(
          await graphql(app, signUpQuery, variables).expect(200),
          'sign_up',
        );

      expect(new Date(createdAt)).toBeValidDate();
      expect(new Date(updatedAt)).toBeValidDate();
      expect(username).toMatch(/unameduser\d{5}/);
      expect(email).toBe(variables.user_input.email);
      expect(payload).toBeNull();
      expect(isVerified).toBeFalse();
    });

    it('should return an error if email exists', async () => {
      const variables = { user_input: UserMock.userWithoutUsername };

      const errors = gqlErrors(
        await graphql(app, signUpQuery, variables).expect(409),
      );

      expect(errors[0].message).toBe('user already exists');
    });
  });

  describe('gql sign_in (mutation)', () => {
    beforeAll(async () => {
      await db.cleanDatabase();
      const variables = { user_input: UserMock.userWithoutUsername };
      await graphql(app, signUpQuery, variables);
    });

    it('should create token pair if credentials correct', async () => {
      const variables = { credentials: UserMock.userWithoutUsername };

      const res = await graphql(app, signInQuery, variables).expect(200);
      const { accessToken, refreshToken } = gqlData(res, 'sign_in');
      const cookies = parseCookies(res);

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

      const res = await graphql(app, signInQuery, variables, [
        'REFRESH=123.123.123',
      ]).expect(200);
      const { reuseDetected } = gqlData(res, 'sign_in');

      expect(reuseDetected).toBeTrue();
    });
  });
});
