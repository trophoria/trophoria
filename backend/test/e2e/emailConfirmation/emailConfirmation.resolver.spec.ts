import { NestFastifyApplication } from '@nestjs/platform-fastify';

import sgMail from '@sendgrid/mail';
import { PrismaService } from '@trophoria/modules/_setup/prisma/prisma.service';
import {
  signInQuery,
  signUpQuery,
} from '@trophoria/test/e2e/auth/auth.queries';
import {
  confirmEmailQuery,
  resendLinkQuery,
} from '@trophoria/test/e2e/emailConfirmation/emailConfirmation.queries';
import { UserMock } from '@trophoria/test/mocks/user.mock';
import {
  gqlData,
  gqlErrors,
  graphql,
  setupE2eTest,
} from '@trophoria/test/utils/e2e-utils';
import { extractTokenFromSendArguments } from '@trophoria/test/utils/extract-token';

jest.mock('@sendgrid/mail', () => {
  return {
    setApiKey: jest.fn(),
    send: jest.fn(() => ({ statusCode: 200, message: 'email sent' })),
  };
});

describe('AuthResolver (e2e)', () => {
  let app: NestFastifyApplication;
  let db: PrismaService;

  beforeAll(async () => {
    ({ app, db } = await setupE2eTest());
  });

  afterAll(() => app.close());

  describe('gql confirmEmail (mutation)', () => {
    let confirmationToken: string;

    beforeAll(async () => {
      (sgMail.send as jest.Mock).mockClear();
      await db.cleanDatabase();
      const variables = { userInput: UserMock.userWithoutUsername };
      await graphql(app, signUpQuery, variables);
      confirmationToken = extractTokenFromSendArguments();
    });

    it('should return an error if the token is invalid / expired', async () => {
      const errors = gqlErrors(
        await graphql(app, confirmEmailQuery, {
          token: UserMock.realisticMockToken,
        }).expect(400),
      );
      expect(errors[0].message).toBe('invalid verification token');
    });

    it('should verify the user', async () => {
      const variables = {
        token: confirmationToken,
      };

      const { message, statusCode } = gqlData(
        await graphql(app, confirmEmailQuery, variables).expect(200),
        'confirmEmail',
      );

      const verifiedUser = await db.user.findUnique({
        where: { email: UserMock.userWithoutUsername.email },
      });

      expect(message).toBe('email successfully verified');
      expect(statusCode).toBe(200);
      expect(verifiedUser.isVerified).toBe(true);
      expect(sgMail.send).toBeCalledTimes(1);
    });
  });

  describe('gql resendConfirmationLink (mutation)', () => {
    let accessToken: string;
    let confirmationToken: string;

    beforeAll(async () => {
      (sgMail.send as jest.Mock).mockClear();
      await db.cleanDatabase();
      const variables = { userInput: UserMock.userWithoutUsername };
      await graphql(app, signUpQuery, variables);
      accessToken = gqlData(
        await graphql(app, signInQuery, {
          credentials: UserMock.userWithoutUsername,
        }),
        'signIn',
      ).accessToken;
      confirmationToken = extractTokenFromSendArguments();
    });

    it('should resend confirmation link if not already confirmed', async () => {
      expect(sgMail.send).toBeCalledTimes(1);

      const { statusCode } = gqlData(
        await graphql(app, resendLinkQuery)
          .set('authorization', `Bearer ${accessToken}`)
          .expect(200),
        'resendConfirmationLink',
      );

      expect(statusCode).toBe(200);
      expect(sgMail.send).toBeCalledTimes(2);
    });

    it('should return error if user already confirmed', async () => {
      await graphql(app, confirmEmailQuery, {
        token: confirmationToken,
      }).expect(200);

      const errors = gqlErrors(
        await graphql(app, resendLinkQuery)
          .set('authorization', `Bearer ${accessToken}`)
          .expect(400),
      );

      expect(sgMail.send).toBeCalledTimes(2);
      expect(errors[0].message).toBe('email already confirmed');
    });
  });
});
