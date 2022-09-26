import { readFileSync } from 'fs';
import path from 'path';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';

import { User } from '@trophoria/graphql/user/user.model';
import { ApiConfigService } from '@trophoria/modules/_setup/config/api-config.service';
import { PrismaService } from '@trophoria/modules/_setup/prisma/prisma.service';
import {
  UserService,
  UserServiceSymbol,
} from '@trophoria/modules/user/business/user.service';
import { UserMock } from '@trophoria/test/mocks/user.mock';
import { setupE2eTest } from '@trophoria/test/utils/e2e-utils';
import { authenticate } from '@trophoria/test/utils/fragments';

describe('UserController (e2e)', () => {
  let app: NestFastifyApplication;
  let db: PrismaService;
  let config: ApiConfigService;
  let userService: UserService;

  beforeAll(async () => {
    ({ app, db, config } = await setupE2eTest());
    userService = app.get<UserService>(UserServiceSymbol);
  });

  afterAll(() => app.close());

  afterEach(jest.clearAllMocks);

  describe('/user/avatar (POST)', () => {
    let accessToken: string;
    let user: User;
    let clientMock: jest.SpyInstance;

    beforeAll(async () => {
      await db.cleanDatabase();
      ({ accessToken, user } = await authenticate(
        app,
        UserMock.userWithoutUsername,
      ));
      clientMock = jest
        .spyOn(userService, 'saveAvatar')
        .mockImplementation(
          async () =>
            `${config.get('MINIO_HOST')}:${config.get('MINIO_PORT')}/avatars/${
              user.id
            }.png`,
        );
    });

    it('should save avatar and associate it with the user', async () => {
      const filePath = path.resolve(__dirname, './assets/avatar.png');

      await request(app.getHttpServer())
        .post('/user/avatar')
        .attach('avatar', filePath)
        .set('authorization', `Bearer ${accessToken}`)
        .expect(201);

      const buffer = readFileSync(filePath);

      expect(clientMock).toBeCalledWith(
        user.id,
        expect.objectContaining({ mimetype: 'image/png', buffer }),
      );
    });

    it('should throw error if the file type is not supported', () => {
      return request(app.getHttpServer())
        .post('/user/avatar')
        .attach('avatar', path.resolve(__dirname, './assets/file.txt'))
        .set('authorization', `Bearer ${accessToken}`)
        .expect(400);
    });
  });
});
