import { UserCreateInput } from '@trophoria/config/graphql/@generated/user/user-create.input';
import { User } from '@trophoria/config/graphql/@generated/user/user.model';

export interface UserService {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User>;
  findByTerm(searchTerm: string): Promise<User[]>;
  findByToken(refreshToken: string): Promise<User>;
  create(user: UserCreateInput, hashPassword?: boolean): Promise<User>;
  markAsVerified(email: string): Promise<User>;
  persistTokens(id: string, tokens: string[]): Promise<User>;
}
