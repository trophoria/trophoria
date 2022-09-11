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

    SEND_GRID_KEY: z.string(),
    SEND_GRID_SENDER_MAIL: z.string().default('support@trophoria.de'),
    SEND_GRID_SENDER_NAME: z.string().default('Trophoria'),

    JWT_PRIVATE_KEY: z.string(),
    JWT_PUBLIC_KEY: z.string(),
    JWT_EXPIRES_IN: z.string().default('30m'),

    JWT_REFRESH_PRIVATE_KEY: z.string(),
    JWT_REFRESH_PUBLIC_KEY: z.string(),
    JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

    EMAIL_CONFIRMATION_URL: z
      .string()
      .default('http:localhost:3000/email-confirmation/confirm'),
    JWT_VERIFICATION_PRIVATE_KEY: z.string(),
    JWT_VERIFICATION_PUBLIC_KEY: z.string(),
    JWT_VERIFICATION_EXPIRES_IN: z.string().default('1h'),
  });

  static envFilePath = 'config/env/.env';
  static testEnvFilePath = 'config/env/.test.env';
  static graphqlSchemaPath = 'config/graphql/schema.gql';
}
