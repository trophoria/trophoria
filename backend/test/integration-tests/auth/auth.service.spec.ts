import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Cache } from 'cache-manager';

import { AppModule } from '@trophoria/app.module';
import { PrismaService } from '@trophoria/modules/_setup/prisma/prisma.service';
import {
  AuthService,
  AuthServiceSymbol,
} from '@trophoria/modules/auth/business/auth.service';
import { UserMock } from '@trophoria/test/mocks/user.mock';

describe('AuthService', () => {
  let service: AuthService;
  let db: PrismaService;
  let cache: Cache;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<AuthService>(AuthServiceSymbol);
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
});
