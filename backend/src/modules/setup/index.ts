import { ApiConfigModule } from './config/api-config.module';
import { MercuriusGraphQLModule } from './graphql/mercurius-graphql.module';
import { RedisCacheModule } from './redis/redis-cache.module';
import { GraphQLThrottlerModule } from './throttler/graphql-throttler.module';

export const SetupModules = [
  ApiConfigModule,
  RedisCacheModule,
  MercuriusGraphQLModule,
  GraphQLThrottlerModule,
];
