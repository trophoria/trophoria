import { Field, Int, ObjectType } from '@nestjs/graphql';

/**
 * Response if sign out process finished successful.
 */
@ObjectType()
export class SignOutResponse {
  @Field(() => String, { nullable: false })
  message!: string;

  @Field(() => Int, { nullable: false })
  statusCode!: number;
}
