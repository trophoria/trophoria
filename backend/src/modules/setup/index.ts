import { ApiConfigModule } from '@trophoria/modules/setup/config/api-config.module';
import { MercuriusGraphQLModule } from '@trophoria/modules/setup/graphql/mercurius-graphql.module';
import { RedisCacheModule } from '@trophoria/modules/setup/redis/redis-cache.module';
import { GraphQLThrottlerModule } from '@trophoria/modules/setup/throttler/graphql-throttler.module';

export const SetupModules = [
  ApiConfigModule,
  RedisCacheModule,
  MercuriusGraphQLModule,
  GraphQLThrottlerModule,
];
