import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Redis from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: Redis,
        host: configService.get('CACHE_HOST'),
        port: configService.get('CACHE_PORT'),
        ttl: configService.get('CACHE_TTL'),
        auth_pass: configService.get('CACHE_PASSWORD'),
      }),
    }),
  ],
})
export class RedisCacheModule {}
