import { z } from 'zod';

export class TrophoriaConfig {
  static envValidationSchema = z.object({
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),

    DATABASE_HOST: z.string().default('localhost'),
    DATABASE_USER: z.string().default('postgres'),
    DATABASE_DB: z.string().default('default_database'),
    DATABASE_PORT: z.preprocess(parseInt, z.number()).default(5432),
    DATABASE_PASSWORD: z.string(),

    CACHE_PORT: z.preprocess(parseInt, z.number()).default(6379),
    CACHE_TTL: z.preprocess(parseInt, z.number()).default(600),
    CACHE_HOST: z.string().default('redis'),
    CACHE_PASSWORD: z.string(),

    THROTTLE_TTL: z.preprocess(parseInt, z.number()).default(60),
    THROTTLE_LIMIT: z.preprocess(parseInt, z.number()).default(10),

    API_PORT: z.preprocess(parseInt, z.number()).default(3000),
    API_HOST: z.string().default('0.0.0.0'),
    COOKIE_SECRET: z.string(),
  });

  static envFilePath = 'config/env/.env';
  static graphqlSchemaPath = 'config/graphql/schema.gql';
}
