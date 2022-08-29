import { User, UserCreateInput } from '@trophoria/graphql';
import { TokenPayload } from '@trophoria/modules/auth/boundary/dto/token-payload.model';
import { TokenPair } from '@trophoria/modules/auth/entity/models/token-pair.model';

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
   * @param user            The user which should get signed in
   * @param refreshCookie   The refresh token persisted in cookies
   * @returns               The generated token pair and a reuse detection flag
   */
  signIn(user: User, refreshCookie?: string): Promise<TokenPayload>;

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

  /**
   * Signs an access and refresh token key pair for the user with the provided
   * id. In order to securely store refresh token information in the database,
   * a jwt id is added to the refresh token. This id gets automatically generated
   * and returned which the tokens.
   *
   * @param id  The unique id of the user
   * @returns   The token pair and the id of the refresh token
   */
  generateTokenPair(id: string): TokenPair;

  /**
   * Verifies if the refresh token is valid. If this is the case, the
   * user associated with this token gets returned. If the token is invalid,
   * an {@link HttpException} gets thrown. If a token reuse gets detected,
   * all valid user tokens are getting invalidated.
   *
   * @param refreshToken  The refresh token to validate
   * @throws              {@link HttpException} if token is invalid
   * @returns             The user associated to the token if valid
   */
  verifyRefreshToken(refreshToken: string): Promise<User>;

  /**
   * Generates a new token pair and updating the current session token in the
   * database. This method does not validate the refresh token! For this, use
   * the {@link verifyRefreshToken} method before or use the {@link JwtRefreshGuard}
   * decorator.
   *
   * @param user  The user to generate a fresh key pair for
   * @returns      The generated token pair
   */
  refreshToken(user: User): Promise<TokenPayload>;
}
