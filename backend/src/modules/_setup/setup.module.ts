import { Module } from '@nestjs/common';

import { ApiConfigModule } from '@trophoria/modules/_setup/config/api-config.module';
import { MercuriusGraphQLModule } from '@trophoria/modules/_setup/graphql/mercurius-graphql.module';
import { PinoLoggerModule } from '@trophoria/modules/_setup/logger/pino-logger.module';
import { PrismaModule } from '@trophoria/modules/_setup/prisma/prisma.module';
import { RedisCacheModule } from '@trophoria/modules/_setup/redis/redis-cache.module';
import { ApiThrottlerModule } from '@trophoria/modules/_setup/throttler/graphql-throttler.module';

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
