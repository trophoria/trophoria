import { UserCreateInput } from '@trophoria/config/graphql/@generated/user/user-create.input';
import { User } from '@trophoria/config/graphql/@generated/user/user.model';

export const AuthServiceSymbol = Symbol('AuthService');

export interface AuthService {
  /**
   * Registers a new {@link User} in the system. If no username was
   * provided, a name based on the email gets randomly generated. If
   * the email or username already exists, a {@link HttpException} gets
   * thrown.
   *
   * @param user  The user dto which should get persisted
   * @throws      {@link HttpException} if username or email already exists
   * @returns     The freshly created user
   */
  signUp(user: UserCreateInput): Promise<User>;
}
