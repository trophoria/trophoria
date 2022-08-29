import { User, UserCreateInput } from '@trophoria/graphql';
import { TokenPayload } from '@trophoria/modules/auth/boundary/dto/token-payload.model';

/** Symbol to inject the user service. */
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

  /**
   * Signs in the provided user. This means generating a new
   * access and refresh token. The id of the refresh token gets
   * saved to database, to be able to detect token reuse in the future.
   *
   * @param user          The user which should get signed in
   * @param refreshId     The id of the existing refresh cookie
   */
  signIn(user: User, refreshId?: string): Promise<TokenPayload>;

  /**
   * Returns the user in database with the provided email if the plain password
   * matches the persisted password hash. If the credentials do not match,
   * a {@link HttpException} gets thrown.
   *
   * @param email     The email of the user account
   * @param password  The password of the user account
   * @throws          {@link HttpException} if password does not match
   * @returns         The found user object if password matches
   */
  getAuthenticatedUser(email: string, password: string): Promise<User>;
}
