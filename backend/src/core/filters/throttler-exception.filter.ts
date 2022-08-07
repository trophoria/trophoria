import { Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { ThrottlerException } from '@nestjs/throttler';

import { RequestLimitExceededException } from '@trophoria/core/errors/request_limit_exceeded.error';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements GqlExceptionFilter {
  catch() {
    return new RequestLimitExceededException(
      parseInt(process.env.THROTTLE_LIMIT),
      parseInt(process.env.THROTTLE_TTL),
    );
  }
}
