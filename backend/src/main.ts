import { fastifyCookie } from '@fastify/cookie';
import fastifyCsrf from '@fastify/csrf-protection';
import helmet from '@fastify/helmet';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { Logger } from 'nestjs-pino';
import { AppModule } from '@trophoria/app.module';
import { ThrottlerExceptionFilter } from '@trophoria/core/filters/throttler-exception.filter';

const bootstrapApp = async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true },
  );

  await initializeApp(app);

  app.listen(process.env.PORT ?? 3000, '0.0.0.0');
};

const initializeApp = async (app: NestFastifyApplication) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieSecret = process.env.COOKIE_SECRET;

  app.useLogger(app.get(Logger));

  await app.register(helmet, { contentSecurityPolicy: isProduction });
  await app.register(fastifyCookie, { secret: cookieSecret });
  await app.register(fastifyCsrf, { cookieOpts: { signed: true } });

  app.useGlobalFilters(new ThrottlerExceptionFilter());
};

bootstrapApp();
