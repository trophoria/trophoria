import { CACHE_MANAGER, HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';

import { AppModule } from '@trophoria/app.module';
import { User } from '@trophoria/graphql';
import { PrismaService } from '@trophoria/modules/_setup/prisma/prisma.service';
import {
  AuthService,
  AuthServiceSymbol,
} from '@trophoria/modules/auth/business/auth.service';
import { UserService, UserServiceSymbol } from '@trophoria/modules/user';
import { UserMock } from '@trophoria/test/mocks/user.mock';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let db: PrismaService;
  let cache: Cache;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<AuthService>(AuthServiceSymbol);
    userService = module.get<UserService>(UserServiceSymbol);
    db = module.get<PrismaService>(PrismaService);
    cache = module.get<Cache>(CACHE_MANAGER);
  });

  it('services should be defined', () => {
    expect(service).toBeDefined();
    expect(db).toBeDefined();
    expect(cache).toBeDefined();
  });

  describe('should create new users', () => {
    beforeAll(async () => db.cleanDatabase());

    it('should hash the users password', async () => {
      const createdUser = await service.signUp(UserMock.mockUsers[0]);
      expect(createdUser.password).not.toBe(UserMock.mockUsers[0].password);
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

      expect(updatedUser.tokens).toContain(refreshToken);
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

      expect(updatedUser.tokens).toContainAllValues([
        refreshToken,
        '123.123.123',
      ]);
    });

    it('should detect token reuse', async () => {
      const { reuseDetected, refreshToken } = await service.signIn(
        createdUser,
        '42.42.42',
      );
      const updatedUser = await userService.findById(createdUser.id);

      expect(reuseDetected).toBeTrue();
      expect(updatedUser.tokens).toStrictEqual([refreshToken]);
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
});
