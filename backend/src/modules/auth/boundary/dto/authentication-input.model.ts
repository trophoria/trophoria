import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MaxLength, Length } from 'class-validator';

/**
 * Input for local authentication via email and password.
 */
@InputType()
export class AuthenticationInput {
  @Field(() => String, { nullable: false })
  @IsEmail()
  @MaxLength(50)
  email!: string;

  @Field(() => String, { nullable: false })
  @Length(10, 50)
  password!: string;
}
