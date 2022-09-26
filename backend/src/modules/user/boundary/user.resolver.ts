import { Inject, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserUpdateInput } from '@trophoria/graphql/user/user-update.input';

import { User } from '@trophoria/graphql/user/user.model';
import { GraphQLThrottlerGuard } from '@trophoria/libs/common';
import { CurrentUser } from '@trophoria/modules/auth/boundary/decorators/user.decorator';
import { JwtAuthGuard } from '@trophoria/modules/auth/boundary/guards/jwt.guard';
import {
  UserService,
  UserServiceSymbol,
} from '@trophoria/modules/user/business/user.service';

@Resolver()
@UseGuards(GraphQLThrottlerGuard)
export class UserResolver {
  constructor(
    @Inject(UserServiceSymbol) private readonly userService: UserService,
  ) {}

  @Query((_returns) => User, { name: 'me' })
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: User) {
    return user;
  }

  @Mutation((_returns) => User, { name: 'deleteUser' })
  @UseGuards(JwtAuthGuard)
  async deleteUser(@CurrentUser() user: User) {
    return this.userService.delete(user.id);
  }

  @Mutation((_returns) => User, { name: 'updateUser' })
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @CurrentUser() user: User,
    @Args('userInput') userUpdate: UserUpdateInput,
  ) {
    return this.userService.update(user.id, userUpdate);
  }
}
