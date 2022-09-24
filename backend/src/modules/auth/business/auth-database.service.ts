import { randomUUID } from 'crypto';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hash } from 'bcrypt';

import { UserCreateInput } from '@trophoria/graphql/user/user-create.input';
import { User } from '@trophoria/graphql/user/user.model';
import {
  BasicResponse,
  JwtPayload,
  removeIfExists,
} from '@trophoria/libs/common';
import { ApiConfigService } from '@trophoria/modules/_setup/config/api-config.service';
import { TokenPayload } from '@trophoria/modules/auth/boundary/dto/token-payload.model';
import { AuthService } from '@trophoria/modules/auth/business/auth.service';
import { TokenPair } from '@trophoria/modules/auth/entity/token-pair.model';
import {
  EmailConfirmationService,
  EmailConfirmationSymbol,
} from '@trophoria/modules/auth/modules/emailConfirmation/business/email-confirmation.service';
import {
  UserService,
  UserServiceSymbol,
} from '@trophoria/modules/user/business/user.service';

@Injectable()
export class AuthDatabaseService implements AuthService {
  constructor(
    @Inject(UserServiceSymbol) private readonly userService: UserService,
    @Inject(EmailConfirmationSymbol)
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly jwtService: JwtService,
    private readonly config: ApiConfigService,
  ) {}

  async signUp(user: UserCreateInput): Promise<User> {
    const password = await hash(user.password, 10);
    const created = await this.userService.create({ ...user, password });
    await this.emailConfirmationService.sendVerificationLink(
      created.id,
      created.email,
    );
    return created;
  }

  async signIn(user: User, refreshCookie?: string): Promise<TokenPayload> {
    const { id, tokens } = user;

    const { refreshToken, accessToken, refreshTokenId } =
      this.generateTokenPair(id);

    const refreshId = (this.jwtService.decode(refreshCookie) as JwtPayload)
      ?.jti;

    // If the token already exists in the array, it means that the sign in protocol
    // got called while already signed in. In this case, just remove revoke the
    // old refresh token because a new one got created.
    let filteredTokens = removeIfExists(tokens, refreshId);

    // If a refresh token exists / was provided in the sign in process, check for the
    // token in the database. If the token was not found in the database, which means
    // the token got invalidated but still provided by the client, revoke all tokens
    // of the user because a token reuse was detected.
    let reuseDetected = false;

    if (refreshId && tokens.length > 0) {
      await this.userService.findByToken(refreshId).catch(() => {
        filteredTokens = [];
        reuseDetected = true;
      });
    }

    // Add the generated token to the token list. If a token reuse was detected, invalidate
    // all currently active tokens. If the provided refresh token was already persisted,
    // remove it from the list (invalidate it, because a new one got created).
    await this.userService.persistTokens(id, [
      ...filteredTokens,
      refreshTokenId,
    ]);

    return { accessToken, refreshToken, reuseDetected };
  }

  async signOut(id: string): Promise<BasicResponse> {
    await this.userService.persistTokens(id, []);
    return { message: 'successfully signed out', statusCode: HttpStatus.OK };
  }

  generateTokenPair(id: string): TokenPair {
    const refreshTokenId = randomUUID();

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
        jwtid: refreshTokenId,
      },
    );

    return { accessToken, refreshToken, refreshTokenId };
  }

  async getAuthenticatedUser(email: string, password: string): Promise<User> {
    const user = await this.userService
      .findByEmailOrUsername(email)
      .catch(() => {
        throw new HttpException('invalid credentials', HttpStatus.UNAUTHORIZED);
      });

    if (!compareSync(password, user.password)) {
      throw new HttpException('invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async verifyRefreshToken(refreshToken: string): Promise<User> {
    // Try to decode the token in order to get the token id to look
    // for in the database. If this failed, a wrong token was provided.
    const decoded = this.jwtService.decode(refreshToken) as JwtPayload;

    if (!decoded) {
      throw new HttpException('invalid refresh token', HttpStatus.FORBIDDEN);
    }

    const foundUser: User = await this.userService
      .findByToken(decoded.jti)
      .catch(() => null);

    // The provided refresh token was not found in database. At this point,
    // if the token is a valid jwt token, it was used after invalidation, in other
    // words, a token reuse was detected. All tokens of the hacked user should get
    // invalidated by now.
    if (!foundUser) {
      const reusePayload = this.jwtService.verify<JwtPayload>(refreshToken, {
        publicKey: this.config.get('JWT_REFRESH_PUBLIC_KEY'),
      });
      await this.userService.persistTokens(reusePayload.id, []);
      throw new HttpException('invalid refresh token', HttpStatus.FORBIDDEN);
    }

    let updatedUser: User;

    await this.jwtService
      .verifyAsync<JwtPayload>(refreshToken, {
        publicKey: this.config.get('JWT_REFRESH_PUBLIC_KEY'),
      })
      // If the token was found in database and was a valid jwt token, it means
      // that the token expired. In this case remove the token from database.
      .catch(() => {
        throw new HttpException('invalid refresh token', HttpStatus.FORBIDDEN);
      })
      // Always invalidate the persisted token because it expired
      .finally(async () => {
        const filteredTokens = removeIfExists(foundUser.tokens, decoded.jti);
        updatedUser = await this.userService.persistTokens(
          foundUser.id,
          filteredTokens,
        );
      });

    // At this point everything was ok. No reuse was detected and the token was
    // valid and not expired. Return the user object to create a new token pair.
    return updatedUser;
  }

  async refreshToken(user: User): Promise<TokenPayload> {
    const { refreshToken, accessToken, refreshTokenId } =
      this.generateTokenPair(user.id);

    this.userService.persistTokens(user.id, [...user.tokens, refreshTokenId]);

    return { refreshToken, accessToken, reuseDetected: false };
  }
}
