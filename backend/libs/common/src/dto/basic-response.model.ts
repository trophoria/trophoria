import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BasicResponse {
  @Field(() => String, { nullable: false })
  message!: string;

  @Field(() => Int, { nullable: false })
  statusCode!: number;
}
