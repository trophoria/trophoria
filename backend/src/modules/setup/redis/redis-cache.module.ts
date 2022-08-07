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
        host: configService.get('REDIS_HOST') ?? 'localhost',
        port: configService.get('REDIS_PORT') ?? 6379,
        ttl: configService.get('REDIS_TTL') ?? 600,
        auth_pass: configService.get('REDIS_PASSWORD'),
      }),
    }),
  ],
})
export class RedisCacheModule {}
