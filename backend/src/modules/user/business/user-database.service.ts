import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';

import { hash } from 'bcrypt';
import { StringNullableFilter } from '@trophoria/config/graphql/@generated/prisma/string-nullable-filter.input';
import { UserCreateInput } from '@trophoria/config/graphql/@generated/user/user-create.input';
import { User } from '@trophoria/config/graphql/@generated/user/user.model';
import { UserUpdateInput } from '@trophoria/graphql/user/user-update.input';
import { generateNameFromEmail } from '@trophoria/libs/common';
import { SocialProvider } from '@trophoria/libs/core';
import { PrismaService } from '@trophoria/modules/_setup/prisma/prisma.service';
import {
  EmailConfirmationService,
  EmailConfirmationSymbol,
} from '@trophoria/modules/auth/modules/emailConfirmation/business/email-confirmation.service';
import {
  FileService,
  FileServiceSymbol,
} from '@trophoria/modules/file/business/file.service';
import { File } from '@trophoria/modules/file/entity/file.model';
import {
  UniqueIdentifier,
  UserService,
} from '@trophoria/modules/user/business/user.service';

@Injectable()
export class UserDatabaseService implements UserService {
  constructor(
    private db: PrismaService,
    @Inject(FileServiceSymbol) private readonly fileService: FileService,
    @Inject(forwardRef(() => EmailConfirmationSymbol))
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

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

  async findByProvider(provider: SocialProvider, id: string): Promise<User> {
    return this.db.user.findFirst({
      where: { AND: [{ provider }, { providerId: id }] },
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

  async delete(id: string): Promise<User> {
    const deletedUser = await this.db.user
      .delete({ where: { id } })
      .catch(() => {
        throw new HttpException('invalid id', HttpStatus.NOT_FOUND);
      });

    await this.fileService.delete(deletedUser.id + '.png', 'avatars');

    return deletedUser;
  }

  async update(
    { email, id }: UniqueIdentifier,
    user: UserUpdateInput,
  ): Promise<User> {
    if (!email && !id) {
      throw new HttpException('unique id required', HttpStatus.BAD_REQUEST);
    }

    const password = user.password ? await hash(user.password, 10) : undefined;
    const isVerified = user.email ? false : undefined;
    const updateCondition = email ? { email } : { id };

    const updatedUser = await this.db.user
      .update({
        where: updateCondition,
        data: { ...user, password, isVerified },
      })
      .catch(() => {
        throw new HttpException('invalid id', HttpStatus.NOT_FOUND);
      });

    if (user.email) {
      await this.emailConfirmationService.sendVerificationLink(
        id,
        updatedUser.email,
      );
    }

    return updatedUser;
  }

  async markAsVerified(id: string): Promise<User> {
    return this.db.user.update({
      where: { id },
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

  async saveAvatar(id: string, file: File): Promise<string> {
    const avatar = await this.fileService.save({
      file,
      bucket: 'avatars',
      name: id,
    });
    await this.db.user.update({ where: { id }, data: { avatar } });
    return avatar;
  }
}
