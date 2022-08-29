import { randomUUID } from 'crypto';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hash } from 'bcrypt';

import { UserCreateInput, User } from '@trophoria/graphql';
import { removeIfExists } from '@trophoria/libs/common';
import { ApiConfigService } from '@trophoria/modules/_setup/config/api-config.service';
import { TokenPayload } from '@trophoria/modules/auth/boundary/dto/token-payload.model';
import { AuthService } from '@trophoria/modules/auth/business/auth.service';
import { UserService, UserServiceSymbol } from '@trophoria/modules/user';

@Injectable()
export class AuthDatabaseService implements AuthService {
  constructor(
    @Inject(UserServiceSymbol) private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ApiConfigService,
  ) {}

  async signUp(user: UserCreateInput): Promise<User> {
    const password = await hash(user.password, 10);
    return this.usersService.create({ ...user, password });
  }

  async signIn(user: User, refreshId?: string): Promise<TokenPayload> {
    const { id, tokens } = user;

    const refreshTokenID = randomUUID();

    // For every sign in protocol, generate a new access and refresh token pair
    const accessToken = this.jwtService.sign(
      { id },
      {
        subject: id,
        privateKey: this.config.get<string>('JWT_PRIVATE_KEY'),
        expiresIn: this.config.get<string>('JWT_EXPIRES_IN'),
      },
    );

    const refreshToken = this.jwtService.sign(
      { id },
      {
        subject: id,
        privateKey: this.config.get<string>('JWT_REFRESH_PRIVATE_KEY'),
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN'),
        jwtid: refreshTokenID,
      },
    );

    // If the token already exists in the array, it means that the sign in protocol
    // got called while already signed in. In this case, just remove revoke the
    // old refresh token because a new one got created.
    let filteredTokens = removeIfExists(tokens, refreshId);

    // If a refresh token exists / was provided in the sign in process, check for the
    // token in the database. If the token was not found in the database, which means
    // the token got invalidated but still provided by the client, revoke all tokens
    // of the user because a token reuse was detected.
    let reuseDetected = false;
    if (refreshId) {
      await this.usersService.findByToken(refreshId).catch(() => {
        filteredTokens = [];
        reuseDetected = true;
      });
    }

    // Add the generated token to the token list. If a token reuse was detected, invalidate
    // all currently active tokens. If the provided refresh token was already persisted,
    // remove it from the list (invalidate it, because a new one got created).
    await this.usersService.persistTokens(id, [
      ...filteredTokens,
      refreshTokenID,
    ]);

    return { accessToken, refreshToken, reuseDetected };
  }

  async getAuthenticatedUser(email: string, password: string): Promise<User> {
    const user = await this.usersService
      .findByEmailOrUsername(email)
      .catch(() => {
        throw new HttpException('invalid credentials', HttpStatus.UNAUTHORIZED);
      });

    if (!compareSync(password, user.password)) {
      throw new HttpException('invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
