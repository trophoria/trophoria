import { UseGuards } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';

import { User } from '@trophoria/graphql/user/user.model';
import { GraphQLThrottlerGuard } from '@trophoria/libs/common';
import { CurrentUser } from '@trophoria/modules/auth/boundary/decorators/user.decorator';
import { JwtAuthGuard } from '@trophoria/modules/auth/boundary/guards/jwt.guard';

@Resolver()
@UseGuards(GraphQLThrottlerGuard)
export class UserResolver {
  @Query((_returns) => User, { name: 'me' })
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: User) {
    return user;
  }
}
