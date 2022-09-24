import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@trophoria/app.module';
import { User } from '@trophoria/graphql/user/user.model';
import { PrismaService } from '@trophoria/modules/_setup/prisma/prisma.service';
import {
  EmailConfirmationService,
  EmailConfirmationSymbol,
} from '@trophoria/modules/auth/modules/emailConfirmation/business/email-confirmation.service';
import {
  UserService,
  UserServiceSymbol,
} from '@trophoria/modules/user/business/user.service';
import { UserMock } from '@trophoria/test/mocks/user.mock';
import { extractTokenFromSendArguments } from '@trophoria/test/utils/extract-token';

jest.mock('@sendgrid/mail', () => {
  return {
    setApiKey: jest.fn(),
    send: jest.fn((html) => ({ statusCode: 200, message: 'email sent', html })),
  };
});

describe('EmailConfirmationService', () => {
  let service: EmailConfirmationService;
  let db: PrismaService;
  let userService: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<EmailConfirmationService>(EmailConfirmationSymbol);
    userService = module.get<UserService>(UserServiceSymbol);
    db = module.get<PrismaService>(PrismaService);
  });

  it('services should be defined', () => {
    expect(service).toBeDefined();
    expect(db).toBeDefined();
  });

  describe('should send email and decode token', () => {
    it('should send verification email and decode token correctly', async () => {
      const { email } = UserMock.mockUsers[0];
      const mockId = '12345';

      await service.sendVerificationLink(mockId, email);

      const token = extractTokenFromSendArguments();
      const decoded = await service.decodeVerificationToken(token);

      expect(decoded.id).toBe(mockId);
    });

    it('should throw error if token is invalid', async () => {
      try {
        await service.decodeVerificationToken(UserMock.realisticMockToken);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.getStatus()).toBe(400);
      }
    });
  });

  describe('should resend verification link', () => {
    let createdUser: User;

    beforeAll(async () => {
      await db.cleanDatabase();
      createdUser = await userService.create(UserMock.mockUsers[0]);
    });

    it('should resend link if not already verified', async () => {
      await service.resendConfirmationLink(createdUser.id);

      const token = extractTokenFromSendArguments();
      expect(token).toBeDefined();
    });

    it('should verify a user', async () => {
      const updated = await service.confirmEmail(createdUser.id);
      expect(updated.isVerified).toBeTrue();
    });

    it('should throw an error if resend attempt if already verified', async () => {
      try {
        await service.resendConfirmationLink(createdUser.id);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.getStatus()).toBe(400);
      }
    });
  });
});
