import { fastifyCookie } from '@fastify/cookie';
import helmet from '@fastify/helmet';
import fastifyMultipart from '@fastify/multipart';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication as App,
} from '@nestjs/platform-fastify';
import { FastifyInstance } from 'fastify';
import { Logger } from 'nestjs-pino';

import { AppModule } from '@trophoria/app.module';
import {
  fastifyExpressCompatibleHook,
  ThrottlerExceptionFilter,
} from '@trophoria/libs/common';
import { ApiConfigService } from '@trophoria/modules/_setup/config/api-config.service';
import {
  FileService,
  FileServiceSymbol,
} from '@trophoria/modules/file/business/file.service';

const bootstrapApp = async () => {
  const app: App = await NestFactory.create(AppModule, new FastifyAdapter(), {
    bufferLogs: true,
  });

  const config = app.get(ApiConfigService);
  await initializeApp(app, config);
  app.listen(config.get('API_PORT'), config.get('API_HOST'));
};

export const initializeApp = async (app: App, config: ApiConfigService) => {
  const instance = app.getHttpAdapter().getInstance() as FastifyInstance;

  instance.addHook('onRequest', fastifyExpressCompatibleHook);

  app.useLogger(app.get(Logger));

  await app.register(helmet as never, {
    contentSecurityPolicy: config.isProduction,
  });
  await app.register(fastifyCookie as never, {
    secret: config.get('COOKIE_SECRET'),
  });
  await app.register(fastifyMultipart as never, {
    limits: {
      fieldNameSize: 10,
      fieldSize: 10,
      fields: 1,
      fileSize: 10000,
      files: 1,
    },
  });

  const fileService = app.get<FileService>(FileServiceSymbol);
  await fileService.createReadOnlyBucket('avatars');

  app.setGlobalPrefix(config.get('API_PREFIX'));

  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true }));

  app.useGlobalFilters(new ThrottlerExceptionFilter(config));
};

if (process.env.NODE_ENV !== 'test') bootstrapApp();
