import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';

import { errorFormatter } from '@trophoria/modules/setup/graphql/mercurius-graphql.service';

@Module({
  imports: [
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      autoSchemaFile: join(process.cwd(), 'config/graphql/schema.gql'),
      sortSchema: true,
      graphiql: true,
      errorFormatter: errorFormatter,
    }),
  ],
})
export class MercuriusGraphQLModule {}
