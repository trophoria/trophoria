import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import {
  StringNullableFilter,
  UserCreateInput,
  User,
} from '@trophoria/graphql';
import { generateNameFromEmail } from '@trophoria/libs/common';
import { PrismaService } from '@trophoria/modules/_setup/prisma/prisma.service';
import { UserService } from '@trophoria/modules/user/business/user.service';

@Injectable()
export class UserDatabaseService implements UserService {
  constructor(private db: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.db.user.findMany();
  }

  async findById(id: string): Promise<User> {
    return this.db.user.findUniqueOrThrow({ where: { id } }).catch(() => {
      throw new HttpException(
        'user with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    });
  }

  async findByEmailOrUsername(identifier: string): Promise<User> {
    return this.db.user
      .findFirstOrThrow({
        where: { OR: [{ email: identifier }, { username: identifier }] },
      })
      .catch(() => {
        throw new HttpException(
          'user with this username or email does not exist',
          HttpStatus.NOT_FOUND,
        );
      });
  }

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

  async create(user: UserCreateInput): Promise<User> {
    const usernameExists = async (name: string) =>
      (await this.db.user.count({ where: { username: name } })) > 0;

    let { username } = user;
    const { email, password } = user;

    if (!username) {
      username = generateNameFromEmail(email, 5);
      let rerolls = 0;

      while (usernameExists(username) && rerolls++ < 5) {
        username = generateNameFromEmail(email, 5);
      }
    }

    return this.db.user
      .create({ data: { ...user, password, username } })
      .catch(() => {
        throw new HttpException('user already exists', HttpStatus.CONFLICT);
      });
  }

  async markAsVerified(email: string): Promise<User> {
    return this.db.user.update({
      where: { email },
      data: { isVerified: true },
    });
  }

  async persistTokens(id: string, tokens: string[]): Promise<User> {
    const alreadyAssigned = await this.db.user.findFirst({
      where: { AND: [{ tokens: { hasSome: tokens } }, { id: { not: id } }] },
    });

    if (alreadyAssigned) {
      throw new HttpException('token already assigned', HttpStatus.CONFLICT);
    }

    return this.db.user.update({ where: { id }, data: { tokens } });
  }
}
