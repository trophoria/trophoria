import { NestFastifyApplication } from '@nestjs/platform-fastify';

import { PrismaService } from '@trophoria/modules/_setup/prisma/prisma.service';
import { signUpQuery } from '@trophoria/test/e2e/auth/auth.queries';
import { data, graphql, setupE2eTest } from '@trophoria/test/e2e/e2e-utils';
import { UserMock } from '@trophoria/test/mocks/user.mock';

describe('AuthResolver (e2e)', () => {
  let app: NestFastifyApplication;
  let db: PrismaService;

  beforeAll(async () => ({ app, db } = await setupE2eTest()));
  afterAll(() => app.close());

  describe('qql sign_up (mutation)', () => {
    beforeAll(() => db.cleanDatabase());

    it('should sign up without username', async () => {
      const variables = { user_input: UserMock.userWithoutUsername };

      const { createdAt, email, payload, updatedAt, username } = data(
        await graphql(app, signUpQuery, variables).expect(200),
        'sign_up',
      );

      expect(new Date(createdAt)).toBeValidDate();
      expect(new Date(updatedAt)).toBeValidDate();
      expect(username).toMatch(/unameduser\d{5}/);
      expect(email).toBe(variables.user_input.email);
      expect(payload).toBeNull();
    });
  });
});
