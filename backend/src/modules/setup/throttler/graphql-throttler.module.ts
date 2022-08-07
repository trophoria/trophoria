import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config) => ({
        ttl: config.get('THROTTLE_TTL') ?? 60,
        limit: config.get('THROTTLE_LIMIT') ?? 10,
      }),
    }),
  ],
})
export class GraphQLThrottlerModule {}
