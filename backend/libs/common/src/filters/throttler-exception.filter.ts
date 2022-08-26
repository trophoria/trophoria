import { Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { ThrottlerException } from '@nestjs/throttler';

import { RequestLimitExceededException } from '@trophoria/libs/common';
import { ApiConfigService } from '@trophoria/modules/_setup/config/api-config.service';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements GqlExceptionFilter {
  constructor(private config: ApiConfigService) {}

  catch() {
    throw new RequestLimitExceededException(
      parseInt(this.config.get('THROTTLE_LIMIT')),
      parseInt(this.config.get('THROTTLE_TTL')),
    );
  }
}
