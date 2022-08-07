import { Resolver, Query } from '@nestjs/graphql';

@Resolver(() => String)
export class PersonResolver {
  @Query(() => String)
  hello() {
    return 'world';
  }
}
