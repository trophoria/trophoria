import { UseGuards } from '@nestjs/common';
import { Args, HideField, Mutation, Query, Resolver } from '@nestjs/graphql';

import { GraphQLThrottlerGuard } from '@trophoria/libs/common';
import { AllUsersFilterDto } from '@trophoria/modules/user/boundary/dto/all-users-filter.dto';
import { UserService } from '@trophoria/modules/user/business/user.service';
import { UserCreateInput } from 'config/graphql/@generated/user/user-create.input';
import { User } from 'config/graphql/@generated/user/user.model';

@Resolver()
@UseGuards(GraphQLThrottlerGuard)
export class UserResolver {
  constructor(private userService: UserService) {}

  @HideField()
  @Query(() => [User], { name: 'users' })
  getAllUsers(@Args('filter', { nullable: true }) filter?: AllUsersFilterDto) {
    return this.userService.findFiltered(filter);
  }

  @Mutation(() => User, { name: 'create_user' })
  createUser(@Args('user_input') user: UserCreateInput) {
    return this.userService.create(user, true);
  }
}
