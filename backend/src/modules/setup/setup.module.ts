import { Module } from '@nestjs/common';

import { ApiConfigModule } from '@trophoria/modules/setup/config/api-config.module';
import { MercuriusGraphQLModule } from '@trophoria/modules/setup/graphql/mercurius-graphql.module';
import { PinoLoggerModule } from '@trophoria/modules/setup/logger/pino-logger.module';
import { PrismaModule } from '@trophoria/modules/setup/prisma/prisma.module';
import { RedisCacheModule } from '@trophoria/modules/setup/redis/redis-cache.module';
import { ApiThrottlerModule } from '@trophoria/modules/setup/throttler/graphql-throttler.module';

@Module({
  imports: [
    ApiConfigModule,
    PinoLoggerModule,
    RedisCacheModule,
    PrismaModule,
    MercuriusGraphQLModule,
    ApiThrottlerModule,
  ],
})
export class SetupModule {}
