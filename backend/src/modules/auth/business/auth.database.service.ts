import { Inject, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { UserCreateInput } from '@trophoria/config/graphql/@generated/user/user-create.input';
import { User } from '@trophoria/config/graphql/@generated/user/user.model';
import { AuthService } from '@trophoria/modules/auth/business/auth.service';
import {
  UserService,
  UserServiceSymbol,
} from '@trophoria/modules/user/user.module';

@Injectable()
export class AuthDatabaseService implements AuthService {
  constructor(
    @Inject(UserServiceSymbol) private readonly usersService: UserService,
  ) {}

  async signUp(user: UserCreateInput): Promise<User> {
    const password = await hash(user.password, 10);
    return this.usersService.create({ ...user, password });
  }
}
