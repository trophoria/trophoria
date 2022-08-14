import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { Cache } from 'cache-manager';

import { generateNameFromEmail } from '@trophoria/libs/common';
import { PrismaService } from '@trophoria/modules/setup/prisma/prisma.service';
import { AllUsersFilterDto } from '@trophoria/modules/user/boundary/dto/all-users-filter.dto';
import { StringNullableFilter } from 'config/graphql/@generated/prisma/string-nullable-filter.input';
import { UserCreateInput } from 'config/graphql/@generated/user/user-create.input';

@Injectable()
export class UserService {
  constructor(
    private db: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async findFiltered(filter?: AllUsersFilterDto) {
    const { id, query } = filter || {};

    if (id && query) {
      throw new HttpException(
        'cant filter id and query simultaneously',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (id) return this.findById(id);
    if (query) return this.findByQuery(query);

    return this.findAll();
  }

  async findAll() {
    return this.db.user.findMany();
  }

  async findById(id: string) {
    return this.db.user.findUniqueOrThrow({ where: { id } }).catch(() => {
      throw new HttpException(
        'user with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    });
  }

  async findByQuery(query: string) {
    const containsQuery: StringNullableFilter = {
      contains: query,
      mode: 'insensitive',
    };

    return this.db.user.findMany({
      where: {
        OR: [{ username: containsQuery }, { email: containsQuery }],
      },
    });
  }

  async findByToken(refreshToken: string) {
    return this.db.user.findFirst({
      where: { tokens: { has: refreshToken } },
    });
  }

  async create(user: UserCreateInput, hashPassword = false) {
    if (!user.username) {
      let username = generateNameFromEmail(user.email, 5);
      while ((await this.db.user.count({ where: { username } })) > 0) {
        username = generateNameFromEmail(user.email, 5);
      }
      user.username = username;
    }

    if (hashPassword) {
      user.password = await hash(user.password, 10);
    }

    return this.db.user.create({ data: user }).catch(() => {
      throw new HttpException('user already exists', HttpStatus.CONFLICT);
    });
  }

  async markAsConfirmed(email: string) {
    return this.db.user.update({
      where: { email },
      data: { isVerified: true },
    });
  }

  async clearRefreshTokens(id: string) {
    return this.db.user.update({
      where: { id },
      data: { tokens: [] },
    });
  }
}
