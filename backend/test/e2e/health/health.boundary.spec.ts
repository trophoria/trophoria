import { NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';

import { pingQuery } from '@trophoria/test/e2e/health/health.queries';
import {
  gqlData,
  graphql,
  setupE2eTest,
} from '@trophoria/test/utils/e2e-utils';

describe('HealthBoundary (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => ({ app } = await setupE2eTest()));
  afterAll(() => app.close());

  it('/graphql (POST)', async () => {
    const pong = gqlData(await graphql(app, pingQuery).expect(200), 'ping');
    expect(pong).toBe('pong');
  });

  it('/health/ping (GET)', () => {
    return request(app.getHttpServer())
      .get('/health/ping')
      .expect(200)
      .expect('pong');
  });
});
