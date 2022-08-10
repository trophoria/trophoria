import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { GraphQLThrottlerGuard } from '@trophoria/libs/common';

@Resolver()
@UseGuards(GraphQLThrottlerGuard)
export class HealthResolver {
  @Query(() => String)
  ping() {
    return 'pong';
  }
}
