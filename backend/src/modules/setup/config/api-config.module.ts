import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';

const toNum = (val: string) => parseInt(val);

const validationSchema = z.object({
  DATABASE_URL: z
    .string()
    .default('postgresql://postgres:postgres@localhost:5432/default_database'),
  POSTGRES_USER: z.string().default('postgres'),
  POSTGRES_DB: z.string().default('default_database'),
  POSTGRES_PORT: z.preprocess(toNum, z.number()).default(5432),
  POSTGRES_PASSWORD: z.string(),

  REDIS_PORT: z.preprocess(toNum, z.number()).default(6379),
  REDIS_TTL: z.preprocess(toNum, z.number()).default(600),
  REDIS_HOST: z.string().default('redis'),
  REDIS_PASSWORD: z.string(),

  THROTTLE_TTL: z.preprocess(toNum, z.number()).default(60),
  THROTTLE_LIMIT: z.preprocess(toNum, z.number()).default(10),
  API_PORT: z.preprocess(toNum, z.number()).default(3000),
  COOKIE_SECRET: z.string(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: 'config/env/.env',
      validate: validationSchema.parse,
    }),
  ],
})
export class ApiConfigModule {}
