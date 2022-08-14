import { Field, InputType } from '@nestjs/graphql';
import * as Validator from 'class-validator';

@InputType()
export class AllUsersFilterDto {
  @Field(() => String, { nullable: true })
  @Validator.IsOptional()
  query?: string;

  @Field(() => String, { nullable: true })
  @Validator.IsOptional()
  id?: string;
}
