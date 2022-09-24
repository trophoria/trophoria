import { HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@trophoria/app.module';
import { User } from '@trophoria/graphql/user/user.model';
import { JwtPayload } from '@trophoria/libs/common';
import { ApiConfigService } from '@trophoria/modules/_setup/config/api-config.service';
import { PrismaService } from '@trophoria/modules/_setup/prisma/prisma.service';
import { TokenPayload } from '@trophoria/modules/auth/boundary/dto/token-payload.model';
import {
  AuthService,
  AuthServiceSymbol,
} from '@trophoria/modules/auth/business/auth.service';
import {
  UserService,
  UserServiceSymbol,
} from '@trophoria/modules/user/business/user.service';
import { UserMock } from '@trophoria/test/mocks/user.mock';

jest.mock('@sendgrid/mail', () => {
  return {
    setApiKey: jest.fn(),
    send: jest.fn(() => ({ statusCode: 200, message: 'email sent' })),
  };
});

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let db: PrismaService;
  let jwt: JwtService;
  let config: ApiConfigService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<AuthService>(AuthServiceSymbol);
    userService = module.get<UserService>(UserServiceSymbol);
    db = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
    config = module.get<ApiConfigService>(ApiConfigService);
  });

  it('services should be defined', () => {
    expect(service).toBeDefined();
    expect(db).toBeDefined();
  });

  describe('should create new users', () => {
    beforeAll(async () => db.cleanDatabase());

    it('should hash the users password', async () => {
      const createdUser = await service.signUp(UserMock.mockUsers[0]);
      expect(createdUser.password).not.toBe(UserMock.mockUsers[0].password);
    });
  });

  describe('should sign jwt key pairs', () => {
    let createdUser: User;

    beforeAll(async () => {
      await db.cleanDatabase();
      createdUser = await service.signUp(UserMock.mockUsers[0]);
    });

    it('should sign a jwt key pair', async () => {
      const { refreshToken, accessToken, refreshTokenId } =
        service.generateTokenPair(createdUser.id);

      const { jti } = jwt.decode(refreshToken) as JwtPayload;

      expect(refreshTokenId).toContain(jti);
      expect(accessToken).toMatch(/^[^.]*\.[^.]*\.[^.]*$/);
      expect(refreshToken).toMatch(/^[^.]*\.[^.]*\.[^.]*$/);
    });
  });

  describe('should authenticate a user', () => {
    let createdUser: User;

    beforeAll(async () => {
      await db.cleanDatabase();
      createdUser = await service.signUp(UserMock.mockUsers[0]);
    });

    it('should return user if credentials match', async () => {
      const found = await service.getAuthenticatedUser(
        UserMock.mockUsers[0].email,
        UserMock.mockUsers[0].password,
      );

      expect(found).toStrictEqual(createdUser);
    });

    it('should throw an error if identifier was not found', async () => {
      try {
        await service.getAuthenticatedUser(
          'test.mail@trophoria.de',
          UserMock.mockUsers[0].password,
        );
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.getStatus()).toBe(401);
        expect(err.message).toBe('invalid credentials');
      }
    });

    it('should throw an error if password does not match', async () => {
      try {
        await service.getAuthenticatedUser(UserMock.mockUsers[0].email, '123');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.getStatus()).toBe(401);
        expect(err.message).toBe('invalid credentials');
      }
    });
  });

  describe('should sign token pairs', () => {
    let createdUser: User;

    beforeAll(async () => {
      await db.cleanDatabase();
      createdUser = await service.signUp(UserMock.mockUsers[0]);
    });

    it('should create token pair and save refresh token to user', async () => {
      const { accessToken, refreshToken, reuseDetected } = await service.signIn(
        createdUser,
      );

      const updatedUser = await userService.findById(createdUser.id);

      const { jti } = jwt.decode(refreshToken, { json: true }) as JwtPayload;

      expect(updatedUser.tokens).toContain(jti);
      expect(accessToken).toMatch(/^[^.]*\.[^.]*\.[^.]*$/);
      expect(refreshToken).toMatch(/^[^.]*\.[^.]*\.[^.]*$/);
      expect(reuseDetected).toBeFalse();
    });

    it('should persist a new token if no cookie was provided (new session)', async () => {
      const { refreshToken } = await service.signIn({
        ...createdUser,
        tokens: ['123.123.123'],
      });

      const updatedUser = await userService.findById(createdUser.id);

      const { jti } = jwt.decode(refreshToken, { json: true }) as JwtPayload;

      expect(updatedUser.tokens).toContainAllValues([jti, '123.123.123']);
    });

    it('should detect token reuse', async () => {
      const reusedToken = jwt.sign(
        { id: createdUser.id },
        {
          subject: createdUser.id,
          privateKey: config.get<string>('JWT_REFRESH_PRIVATE_KEY'),
          expiresIn: config.get<string>('JWT_REFRESH_EXPIRES_IN'),
          jwtid: '42',
        },
      );

      const { reuseDetected, refreshToken } = await service.signIn(
        await userService.findById(createdUser.id),
        reusedToken,
      );

      const updatedUser = await userService.findById(createdUser.id);
      const { jti } = jwt.decode(refreshToken) as JwtPayload;

      expect(reuseDetected).toBeTrue();
      expect(updatedUser.tokens).toStrictEqual([jti]);
    });
  });

  describe('should validate refresh tokens', () => {
    let createdUser: User;
    let tokenPayload: TokenPayload;

    beforeAll(async () => {
      await db.cleanDatabase();
      createdUser = await service.signUp(UserMock.mockUsers[0]);
      tokenPayload = await service.signIn(createdUser);
    });

    it('should return the user from valid refresh token', async () => {
      const foundUser = await service.verifyRefreshToken(
        tokenPayload.refreshToken,
      );

      expect(foundUser).toStrictEqual(createdUser);
    });

    it('should throw an error if no jwt is provided', async () => {
      try {
        await service.verifyRefreshToken('123');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.getStatus()).toBe(403);
      }
    });

    it('should throw an error if provided jwt is expired', async () => {
      const expiredToken = jwt.sign(
        { id: createdUser.id },
        {
          subject: createdUser.id,
          privateKey: config.get<string>('JWT_REFRESH_PRIVATE_KEY'),
          expiresIn: '1s',
          jwtid: '42',
        },
      );

      await userService.persistTokens(createdUser.id, ['42']);

      try {
        await new Promise((f) => setTimeout(f, 1100));
        await service.verifyRefreshToken(expiredToken);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.getStatus()).toBe(403);
      }
    });

    it('should throw an error if reuse was detected', async () => {
      const expiredToken = jwt.sign(
        { id: createdUser.id },
        {
          subject: createdUser.id,
          privateKey: config.get<string>('JWT_REFRESH_PRIVATE_KEY'),
          expiresIn: '1s',
          jwtid: '42',
        },
      );

      try {
        await service.verifyRefreshToken(expiredToken);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.getStatus()).toBe(403);
      }
    });
  });

  describe('should sign out a user', () => {
    let createdUser: User;
    let tokenPayload: TokenPayload;

    beforeAll(async () => {
      await db.cleanDatabase();
      createdUser = await service.signUp(UserMock.mockUsers[0]);
      tokenPayload = await service.signIn(createdUser);
    });

    it('should invalidate refresh token', async () => {
      service.signOut(createdUser.id);

      try {
        await service.verifyRefreshToken(tokenPayload.refreshToken);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.getStatus()).toBe(403);
      }
    });
  });
});
