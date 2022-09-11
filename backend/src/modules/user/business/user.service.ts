import { User, UserCreateInput } from '@trophoria/graphql';

/** Symbol to inject the user service. */
export const UserServiceSymbol = Symbol('UserService');

export interface UserService {
  /**
   * Find all persisted {@link User} instances.
   *
   * @returns All persisted users or empty list.
   */
  findAll(): Promise<User[]>;

  /**
   * Find an {@link User} by it's id. If no user with the provided
   * id was found, a {@link HttpException} gets thrown.
   *
   * @param id  The id of the searched user
   * @throws    {@link HttpException} if no user was found
   * @returns   The user with the provided id
   */
  findById(id: string): Promise<User>;

  /**
   * Find an {@link User} by it's email or username. If no user with
   * the provided identifier was found, a {@link HttpException} gets thrown.
   *
   * @param identifier  The email or username of the searched user
   * @throws            {@link HttpException} if no user was found
   * @returns           The user with the provided identifier
   */
  findByEmailOrUsername(identifier: string): Promise<User>;

  /**
   * Finds all instances of {@link User} matching the search term.
   * If the username or email of the user contains the term in
   * any way, it is contained in the resulting list.
   *
   * @param searchTerm  The term to match username/email against
   * @returns           All matching persons or an empty list
   */
  findByTerm(searchTerm: string): Promise<User[]>;

  /**
   * Finds a {@link User} based on his refresh token list. If no
   * user was found, a {@link HttpException} gets thrown. This function
   * can be used to detect token reuse.
   *
   * @param refreshToken  The token to search in the database
   * @throws              {@link HttpException} if no user contains the provided token
   * @returns             The user with the provided refresh token
   */
  findByToken(refreshToken: string): Promise<User>;

  /**
   * Saves a new {@link User} in the database. If no username was
   * provided, a name based on the email gets randomly generated. If
   * the email or username already exists, a {@link HttpException} gets
   * thrown.
   *
   * @param user          The user dto which should get persisted
   * @throws              {@link HttpException} if username or email already exists
   * @returns             The freshly created user
   */
  create(user: UserCreateInput): Promise<User>;

  /**
   * Mark the {@link User} with the provided id as verified. If the
   * user with email does not exists or the user was already verified,
   * nothing changes.
   *
   * @param id    The id of the user to set the verified flag
   * @returns     The updated user instance
   */
  markAsVerified(id: string): Promise<User>;

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
  persistTokens(id: string, tokens: string[]): Promise<User>;
}
