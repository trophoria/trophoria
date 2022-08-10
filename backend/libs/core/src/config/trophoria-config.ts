import { z } from 'zod';

export class TrophoriaConfig {
  static envValidationSchema = z.object({
    DATABASE_URL: z
      .string()
      .default(
        'postgresql://postgres:postgres@localhost:5432/default_database',
      ),
    POSTGRES_USER: z.string().default('postgres'),
    POSTGRES_DB: z.string().default('default_database'),
    POSTGRES_PORT: z.preprocess(parseInt, z.number()).default(5432),
    POSTGRES_PASSWORD: z.string(),

    REDIS_PORT: z.preprocess(parseInt, z.number()).default(6379),
    REDIS_TTL: z.preprocess(parseInt, z.number()).default(600),
    REDIS_HOST: z.string().default('redis'),
    REDIS_PASSWORD: z.string(),

    THROTTLE_TTL: z.preprocess(parseInt, z.number()).default(60),
    THROTTLE_LIMIT: z.preprocess(parseInt, z.number()).default(10),
    API_PORT: z.preprocess(parseInt, z.number()).default(3000),
    COOKIE_SECRET: z.string(),
  });

  static envFilePath = 'config/env/.env';
  static graphqlSchemaPath = 'config/graphql/schema.gql';
}
