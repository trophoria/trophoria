import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { User } from '@trophoria/graphql/user/user.model';

import { PrismaService } from '@trophoria/modules/_setup/prisma/prisma.service';
import { meQuery } from '@trophoria/test/e2e/auth/auth.queries';
import {
  deleteUserQuery,
  updateUserQuery,
} from '@trophoria/test/e2e/user/user.queries';
import { UserMock } from '@trophoria/test/mocks/user.mock';
import {
  gqlData,
  gqlErrors,
  graphql,
  setupE2eTest,
} from '@trophoria/test/utils/e2e-utils';
import { authenticate } from '@trophoria/test/utils/fragments';

describe('AuthResolver (e2e)', () => {
  let app: NestFastifyApplication;
  let db: PrismaService;

  beforeAll(async () => ({ app, db } = await setupE2eTest()));

  afterAll(() => app.close());

  describe('gql me (query)', () => {
    let accessToken: string;

    beforeAll(async () => {
      await db.cleanDatabase();
      ({ accessToken } = await authenticate(app, UserMock.userWithoutUsername));
    });

    it('should return user object if access token is valid', async () => {
      const res = await graphql(app, meQuery)
        .set('authorization', `Bearer ${accessToken}`)
        .expect(200);

      const user = gqlData(res, 'me');

      expect(new Date(user.createdAt)).toBeValidDate();
      expect(new Date(user.updatedAt)).toBeValidDate();
      expect(user.username).toMatch(/unameduser\d{5}/);
      expect(user.email).toBe(UserMock.userWithoutUsername.email);
      expect(user.payload).toBeNull();
      expect(user.isVerified).toBeFalse();
    });

    it('should return an error if access token is invalid', async () => {
      const errors = gqlErrors(await graphql(app, meQuery).expect(401));
      expect(errors[0].message).toBe('Unauthorized');
    });
  });

  describe('gql deleteUser (mutation)', () => {
    let accessToken: string;

    beforeAll(async () => {
      await db.cleanDatabase();
      ({ accessToken } = await authenticate(app, UserMock.userWithoutUsername));
    });

    it('should delete the authenticated user', async () => {
      await graphql(app, deleteUserQuery)
        .set('authorization', `Bearer ${accessToken}`)
        .expect(200);
    });
  });

  describe('gql updateUser (mutation)', () => {
    let accessToken: string;

    beforeAll(async () => {
      await db.cleanDatabase();
      ({ accessToken } = await authenticate(app, UserMock.userWithoutUsername));
    });

    it('should update the authenticated user', async () => {
      const vars = { userInput: UserMock.updateUsernameInput };

      const res = await graphql(app, updateUserQuery, vars)
        .set('authorization', `Bearer ${accessToken}`)
        .expect(200);

      const user: User = gqlData(res, 'updateUser');

      expect(user.username).toBe(UserMock.updateUsernameInput.username);
    });
  });
});
