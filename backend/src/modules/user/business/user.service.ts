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
import { StringNullableFilter } from 'config/graphql/@generated/prisma/string-nullable-filter.input';
import { UserCreateInput } from 'config/graphql/@generated/user/user-create.input';
import { User } from 'config/graphql/@generated/user/user.model';

@Injectable()
export class UserService {
  constructor(
    private db: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  /**
   * Find all persisted {@link User} instances.
   *
   * @returns All persisted users or empty list.
   */
  async findAll(): Promise<User[]> {
    return this.db.user.findMany();
  }

  /**
   * Find an {@link User} by it's id. If no user with the provided
   * id was found, a {@link HttpException} gets thrown.
   *
   * @param id  The id of the searched user
   * @throws    {@link HttpException} if no user was found
   * @returns   The user with the provided id
   */
  async findById(id: string): Promise<User> {
    return this.db.user.findUniqueOrThrow({ where: { id } }).catch(() => {
      throw new HttpException(
        'user with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    });
  }

  /**
   * Finds all instances of {@link User} matching the search term.
   * If the username or email of the user contains the term in
   * any way, it is contained in the resulting list.
   *
   * @param searchTerm  The term to match username/email against
   * @returns           All matching persons or an empty list
   */
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

  /**
   * Finds a {@link User} based on his refresh token list. If no
   * user was found, a {@link HttpException} gets thrown. This function
   * can be used to detect token reuse.
   *
   * @param refreshToken  The token to search in the database
   * @throws              {@link HttpException} if no user contains the provided token
   * @returns             The user with the provided refresh token
   */
  async findByToken(refreshToken: string): Promise<User> {
    return this.db.user
      .findFirstOrThrow({
        where: { tokens: { has: refreshToken } },
      })
      .catch(() => {
        throw new HttpException('invalid token', HttpStatus.BAD_REQUEST);
      });
  }

  /**
   * Saves a new {@link User} in the database. If no username was
   * provided, a name based on the email gets randomly generated. If
   * the email or username already exists, a {@link HttpException} gets
   * thrown. By default, the password gets already hashed, this however
   * can be turned off to hash the password somewhere else.
   *
   * @param user          The user dto which should get persisted
   * @param hashPassword  (true) Whether the password should get hashed or not
   * @throws              {@link HttpException} if username or email already exists
   * @returns             The freshly created user
   */
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

  /**
   * Mark the {@link User} with the provided email as verified. If the
   * user with email does not exists or the user was already verified,
   * nothing changes.
   *
   * @param email The email of the user to set the verified flag
   * @returns     The updated user instance
   */
  async markAsVerified(email: string): Promise<User> {
    return this.db.user.update({
      where: { email },
      data: { isVerified: true },
    });
  }

  /**
   * Override all active refresh tokens associated with a {@link User}.
   * This can be used to invalidate all token after token reuse
   * (clear all bsy saving []), or just adding a token. In order to optimize
   * database calls, this methods exists instead of single functions to
   * handle tokens. So in order to use this, first read the tokens,
   * manipulate and save them afterwards.
   *
   * @param id      The unique identifier of the user
   * @param tokens  The token list to associate to the user
   * @returns       The user instance with no refresh tokens
   */
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
