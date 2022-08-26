import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserCreateInput } from '@trophoria/config/graphql/@generated/user/user-create.input';

import { User } from '@trophoria/config/graphql/@generated/user/user.model';
import { GraphQLThrottlerGuard } from '@trophoria/libs/common';
import {
  AuthService,
  AuthServiceSymbol,
} from '@trophoria/modules/auth/business/auth.service';

@Resolver()
@UseGuards(GraphQLThrottlerGuard)
export class AuthResolver {
  constructor(
    @Inject(AuthServiceSymbol) private readonly authService: AuthService,
  ) {}

  @Mutation((_returns) => User, { name: 'sign_up' })
  async signUp(@Args('user_input') user: UserCreateInput) {
    return this.authService.signUp(user);
  }
}
