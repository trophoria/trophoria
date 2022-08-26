import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { Cache } from 'cache-manager';

import { StringNullableFilter } from '@trophoria/config/graphql/@generated/prisma/string-nullable-filter.input';
import { UserCreateInput } from '@trophoria/config/graphql/@generated/user/user-create.input';
import { User } from '@trophoria/config/graphql/@generated/user/user.model';
import { Cached, generateNameFromEmail, ToCache } from '@trophoria/libs/common';
import { PrismaService } from '@trophoria/modules/_setup/prisma/prisma.service';
import { UserService } from '@trophoria/modules/user/business/user.service';

@Injectable()
export class UserDatabaseService implements UserService {
  constructor(
    private db: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  @Cached('user-all')
  async findAll(): Promise<User[]> {
    return this.db.user.findMany();
  }

  @Cached('user', { withAttribute: 0 })
  async findById(id: string): Promise<User> {
    return this.db.user.findUniqueOrThrow({ where: { id } }).catch(() => {
      throw new HttpException(
        'user with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    });
  }

  @Cached('users-term', { withAttribute: 0 })
  async findByTerm(searchTerm: string): Promise<User[]> {
    const containsQuery: StringNullableFilter = {
      contains: searchTerm,
      mode: 'insensitive',
    };

    return this.db.user.findMany({
      where: {
        OR: [{ username: containsQuery }, { email: containsQuery }],
      },
    });
  }

  async findByToken(refreshToken: string): Promise<User> {
    return this.db.user
      .findFirstOrThrow({
        where: { tokens: { has: refreshToken } },
      })
      .catch(() => {
        throw new HttpException('invalid token', HttpStatus.BAD_REQUEST);
      });
  }

  @ToCache('user', { withReturnField: 'id' })
  async create(user: UserCreateInput, hashPassword = true): Promise<User> {
    const usernameExists = async (name: string) =>
      (await this.db.user.count({ where: { username: name } })) > 0;

    let { username, password } = user;
    const { email } = user;

    if (!username) {
      username = generateNameFromEmail(email, 5);
      let rerolls = 0;

      while (usernameExists(username) && rerolls++ < 5) {
        username = generateNameFromEmail(email, 5);
      }
    }

    if (hashPassword) {
      password = await hash(user.password, 10);
    }

    return this.db.user
      .create({ data: { ...user, password, username } })
      .catch(() => {
        throw new HttpException('user already exists', HttpStatus.CONFLICT);
      });
  }

  @ToCache('user', { withReturnField: 'id' })
  async markAsVerified(email: string): Promise<User> {
    return this.db.user.update({
      where: { email },
      data: { isVerified: true },
    });
  }

  @ToCache('user', { withAttribute: 0 })
  async persistTokens(id: string, tokens: string[]): Promise<User> {
    const alreadyAssigned = await this.db.user.findFirst({
      where: { tokens: { hasSome: tokens } },
    });

    if (alreadyAssigned) {
      throw new HttpException('token already assigned', HttpStatus.CONFLICT);
    }

    return this.db.user.update({ where: { id }, data: { tokens } });
  }
}
