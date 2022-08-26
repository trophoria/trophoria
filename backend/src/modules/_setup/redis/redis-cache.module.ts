import { CacheModule, Module } from '@nestjs/common';
import * as Redis from 'cache-manager-redis-store';

import { ApiConfigService } from '@trophoria/modules/_setup/config/api-config.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ApiConfigService],
      useFactory: async (configService: ApiConfigService) => {
        if (configService.isTest) return;

        return {
          store: Redis,
          host: configService.get('CACHE_HOST'),
          port: configService.get('CACHE_PORT'),
          ttl: configService.get('CACHE_TTL'),
          auth_pass: configService.get('CACHE_PASSWORD'),
        };
      },
    }),
  ],
})
export class RedisCacheModule {}
