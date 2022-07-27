import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

@Resolver(() => String)
export class PersonResolver {
  @Query(() => String)
  hello() {
    return 'world';
  }
}
