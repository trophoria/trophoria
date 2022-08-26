import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@trophoria/app.module';
import { PrismaService } from '@trophoria/modules/setup/prisma/prisma.service';
import { UserService } from '@trophoria/modules/user/business/user.service';
import { UserMock } from '@trophoria/test/integration-tests/user/mocks/user.mock';
import { User } from 'config/graphql/@generated/user/user.model';

describe('UsersService', () => {
  let service: UserService;
  let db: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<UserService>(UserService);
    db = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('should create new users', () => {
    let createdUser: User;

    beforeAll(async () => db.cleanDatabase());

    it('should create a new user', async () => {
      createdUser = await service.create(UserMock.mockUsers[0]);
      expect(createdUser.email).toBe(UserMock.mockUsers[0].email);
    });

    it('should automatically hash the password with salt', async () => {
      expect(
        createdUser.password !== UserMock.mockUsers[0].password,
      ).toBeTruthy();
    });

    it('should throw on duplicated email/username', async () => {
      try {
        await service.create(UserMock.mockUsers[0]);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.getStatus()).toBe(409);
      }
    });

    it('should create unique username if not provided', async () => {
      const user = await service.create(UserMock.userWithoutUsername);
      expect(user.username).toBeTruthy();
    });

    it('should not hash password if flag is set', async () => {
      const hashLessUser = await service.create(UserMock.mockUsers[1], false);
      expect(
        hashLessUser.password === UserMock.mockUsers[1].password,
      ).toBeTruthy();
    });
  });

  describe('should correctly flag users as verified', () => {
    let createdUser: User;

    beforeAll(async () => db.cleanDatabase());

    it('should be set on false by default', async () => {
      createdUser = await service.create(UserMock.mockUsers[0]);
      expect(createdUser.isVerified).toBeFalsy();
    });

    it('should be able to set to true', async () => {
      const verifiedUser = await service.markAsVerified(createdUser.email);
      expect(verifiedUser.isVerified).toBeTruthy();
    });
  });

  describe('should find users with different queries', () => {
    let createdUsers: User[];

    beforeAll(async () => {
      await db.cleanDatabase();
      createdUsers = await Promise.all([
        service.create(UserMock.mockUsers[0]),
        service.create(UserMock.mockUsers[1]),
        service.create(UserMock.mockUsers[2]),
      ]);
    });

    it('should find all users', async () => {
      const allUsers = await service.findAll();
      expect(allUsers.length).toBe(3);
    });

    it('should find a user by its unique id', async () => {
      const userById = await service.findById(createdUsers[0].id);
      expect(userById).toStrictEqual(createdUsers[0]);
    });

    it('should throw error if wrong id was provided', async () => {
      try {
        await service.findById('-1');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.getStatus()).toBe(404);
      }
    });

    it('should find a user by term in username (insensitive)', async () => {
      const users = await service.findByTerm('user');
      expect(users.length).toBe(2);
    });

    it('should find a user by term in email (insensitive)', async () => {
      const users = await service.findByTerm('world');
      expect(users.length).toBe(1);
    });
  });

  describe('should correctly handle tokens', () => {
    let createdUser: User;

    beforeAll(async () => db.cleanDatabase());

    it('should be an empty array by default', async () => {
      createdUser = await service.create(UserMock.mockUsers[0]);
      expect(createdUser.tokens.length).toBe(0);
    });

    it('should persist a new token array', async () => {
      const changedUser = await service.persistTokens(
        createdUser.id,
        UserMock.mockTokens,
      );
      expect(changedUser.tokens).toStrictEqual(UserMock.mockTokens);
    });

    it('should throw an error if an token was assigned to multiple user', async () => {
      const newUser = await service.create(UserMock.mockUsers[1]);

      try {
        await service.persistTokens(newUser.id, [UserMock.mockToken]);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.getStatus()).toBe(409);
      }
    });

    it('should find the user by any token', async () => {
      const foundUser = await service.findByToken(UserMock.mockTokens[0]);
      expect(foundUser.email).toBe(createdUser.email);
    });

    it('should throw an error if the token is not associated with any user', async () => {
      try {
        await service.findByToken('-1');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.getStatus()).toBe(400);
      }
    });
  });
});
