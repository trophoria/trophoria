import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';

import { GraphQLErrorFormatter } from '@trophoria/libs/common';
import { TrophoriaConfig } from '@trophoria/libs/core';

@Module({
  imports: [
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      autoSchemaFile: join(process.cwd(), TrophoriaConfig.graphqlSchemaPath),
      sortSchema: true,
      graphiql: true,
      errorFormatter: GraphQLErrorFormatter.formatError,
    }),
  ],
})
export class MercuriusGraphQLModule {}
