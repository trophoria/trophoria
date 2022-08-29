import { Field, ObjectType } from '@nestjs/graphql';

/**
 * The response object after successfully signing in. The access token
 * is a short lived token, which should only get stored securely in ram.
 * The refresh token is a long lived token and can be used to obtain new
 * access tokens. If a token reuse was detected, the equivalent flag is set.
 */
@ObjectType()
export class TokenPayload {
  @Field(() => String, { nullable: false })
  accessToken: string;

  @Field(() => String, { nullable: false })
  refreshToken: string;

  @Field(() => Boolean, { nullable: false, defaultValue: false })
  reuseDetected: boolean;
}
