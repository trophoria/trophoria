import { CacheModule as CacheModuleCommon } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Redis from 'cache-manager-redis-store';

export const CacheModule = CacheModuleCommon.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    store: Redis,
    host: configService.get('REDIS_HOST'),
    port: configService.get('REDIS_PORT'),
    ttl: configService.get('REDIS_TTL'),
    auth_pass: configService.get('REDIS_PASSWORD'),
  }),
});
