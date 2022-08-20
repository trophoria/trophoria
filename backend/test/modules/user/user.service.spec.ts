import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@trophoria/app.module';
import { UserService } from '@trophoria/modules/user/business/user.service';

describe('UsersService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', () => {
    service.create({ email: 'tobi.kaerst@gmx.de', password: '1234' });
  });
});
