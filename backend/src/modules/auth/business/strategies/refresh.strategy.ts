import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { Strategy } from 'passport-custom';

import { User } from '@trophoria/graphql/user/user.model';
import {
  AuthService,
  AuthServiceSymbol,
} from '@trophoria/modules/auth/business/auth.service';

/**
 * JWT Refresh token strategy which validates the request by checking
 * if the refresh token is valid and the id is persisted in the database.
 */
@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(@Inject(AuthServiceSymbol) private authService: AuthService) {
    super();
  }

  /**
   * Returns the {@link User} object associated to the id of the refresh token
   * in the database.
   *
   * @param req       The fastify request object
   * @throws          {@link HttpException} if refresh token is invalid / not provided
   * @returns         The user object if refresh token is valid
   */
  async validate(req: FastifyRequest): Promise<User> {
    const refreshToken = req.cookies.REFRESH;

    if (!refreshToken) {
      throw new HttpException('invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    return this.authService.verifyRefreshToken(refreshToken);
  }
}
