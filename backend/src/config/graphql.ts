import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';

export const GraphQlModule = GraphQLModule.forRoot<MercuriusDriverConfig>({
  driver: MercuriusDriver,
  autoSchemaFile: join(process.cwd(), 'config/graphql/schema.gql'),
  sortSchema: true,
  graphiql: true,
});
