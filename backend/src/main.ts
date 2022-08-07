import { fastifyCookie } from '@fastify/cookie';
import fastifyCsrf from '@fastify/csrf-protection';
import helmet from '@fastify/helmet';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from '@trophoria/app.module';
import { ThrottlerExceptionFilter } from '@trophoria/core/filters/throttler-exception.filter';

const bootstrap = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const apiPort = process.env.PORT ?? 3000;
  const cookieSecret = process.env.COOKIE_SECRET;

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.register(helmet, { contentSecurityPolicy: isProduction });
  await app.register(fastifyCookie, { secret: cookieSecret });
  await app.register(fastifyCsrf, { cookieOpts: { signed: true } });

  app.useGlobalFilters(new ThrottlerExceptionFilter());

  app.listen(apiPort, '0.0.0.0');
};

bootstrap();
