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
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.register(helmet, {
    contentSecurityPolicy: process.env.NODE_ENV === 'production',
  });

  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
  });

  await app.register(fastifyCsrf, {
    cookieOpts: { signed: true },
  });

  app.useGlobalFilters(new ThrottlerExceptionFilter());

  app.listen(process.env.PORT ?? 3000, '0.0.0.0', async () =>
    console.log(`Application is running on: ${await app.getUrl()}`),
  );
};

bootstrap();
