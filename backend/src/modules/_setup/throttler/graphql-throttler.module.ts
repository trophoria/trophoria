import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';

import { ApiConfigService } from '@trophoria/modules/_setup/config/api-config.service';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [ApiConfigService],
      useFactory: (config: ApiConfigService) => ({
        ttl: config.get('THROTTLE_TTL'),
        limit: config.get('THROTTLE_LIMIT'),
      }),
    }),
  ],
})
export class ApiThrottlerModule {}
