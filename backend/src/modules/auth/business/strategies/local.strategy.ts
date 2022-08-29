import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Strategy } from 'passport-local';

import {
  AuthService,
  AuthServiceSymbol,
} from '@trophoria/modules/auth/business/auth.service';

/**
 * Local passport strategy which validates the request by searching
 * for the user with the email field and comparing the password field
 * with the persisted password hash.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(AuthServiceSymbol) private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  /**
   * Returns the {@link User} object with the provided email, if the password
   * matches to the persisted password hash.
   *
   * @param email     The email of the user
   * @param password  The plain password of the user
   * @throws          {@link HttpException} if password does not match
   * @returns         The user object if password matches
   */
  async validate(email: string, password: string): Promise<User> {
    return this.authService.getAuthenticatedUser(email, password);
  }
}
