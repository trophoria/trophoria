import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import request, { Response } from 'supertest';

import { AppModule } from '@trophoria/app.module';
import { initializeApp } from '@trophoria/main';
import { ApiConfigService } from '@trophoria/modules/_setup/config/api-config.service';
import { PrismaService } from '@trophoria/modules/_setup/prisma/prisma.service';

/**
 * Setup the fastify application for the e2e testing environment.
 * @returns The testing module, the fastify app and the database service.
 */
export const setupE2eTest = async () => {
  const module = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = module.createNestApplication<NestFastifyApplication>(
    new FastifyAdapter(),
  );

  const db = module.get<PrismaService>(PrismaService);
  const config = module.get<ApiConfigService>(ApiConfigService);

  await app.init();
  await initializeApp(app, config);
  await app.getHttpAdapter().getInstance().ready();

  return { module, app, db };
};

/**
 * Utility function to send a graphql request to the testing application. You
 * can provide a query string and query variables as object to the graphql
 * request.
 *
 * @param app         The fastify testing application.
 * @param query       The graphql query string.
 * @param variables   The graphql query variables.
 * @returns           The supertest request object for more checks.
 */
export const graphql = (
  app: NestFastifyApplication,
  query?: unknown,
  variables?: unknown,
  cookies?: string[],
) => {
  return request(app.getHttpServer())
    .post('/graphql')
    .set('content-type', 'application/json')
    .set('Cookie', cookies ?? [])
    .send({ query, variables });
};

/** A hack literal to get graph ql syntax in vscode. */
export const gql = String.raw;

/**
 * Extract the graphql data out of the supertest response object.
 * You can provide the name of the query result.
 *
 * @param res   The supertest response object.
 * @param name  The name of the query.
 * @returns     The returned data.
 */
export const gqlData = (res: request.Response, name: string) =>
  res.body.data[name];

/**
 * Extract the graphql errors out of the supertest response object.
 *
 * @param res   The supertest response object.
 * @returns     The returned errors.
 */
export const gqlErrors = (res: request.Response) => res.body.errors;

/**
 *
 * @param res
 * @returns
 */
export const parseCookies = (res: Response) => {
  const cookies = {};

  const cookieHeader: string[] = res.headers['set-cookie'];
  cookieHeader.forEach((cookie) => {
    const cookieKeyVal = cookie.split(';')[0].split('=');
    cookies[cookieKeyVal[0]] = cookieKeyVal[1];
  });

  return cookies;
};
