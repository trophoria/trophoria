import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '@trophoria/graphql/user/user.model';
import { ApiConfigService } from '@trophoria/modules/_setup/config/api-config.service';
import { EmailConfirmationService } from '@trophoria/modules/auth/modules/emailConfirmation/business/email-confirmation.service';
import { VerificationTokenPayload } from '@trophoria/modules/auth/modules/emailConfirmation/entity/verification-token-payload.model';
import {
  EmailService,
  EmailServiceSymbol,
} from '@trophoria/modules/email/business/email.service';
import { EmailResponse } from '@trophoria/modules/email/entity/email-response.model';
import {
  UserService,
  UserServiceSymbol,
} from '@trophoria/modules/user/business/user.service';

@Injectable()
export class EmailConfirmationDatabaseService
  implements EmailConfirmationService
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ApiConfigService,
    @Inject(EmailServiceSymbol) private readonly emailService: EmailService,
    @Inject(UserServiceSymbol) private readonly userService: UserService,
  ) {}

  sendVerificationLink(id: string, email: string): Promise<EmailResponse> {
    const verificationToken = this.jwtService.sign(
      { id },
      {
        subject: id,
        privateKey: this.config.get<string>('JWT_VERIFICATION_PRIVATE_KEY'),
        expiresIn: this.config.get<string>('JWT_VERIFICATION_EXPIRES_IN'),
      },
    );

    const url = `${this.config.get(
      'EMAIL_CONFIRMATION_URL',
    )}?token=${verificationToken}`;

    const content = `To confirm the email address, <a href="${url}">click here</a>!`;

    return this.emailService.send({
      to: email,
      subject: 'Email confirmation',
      html: content,
    });
  }

  async resendConfirmationLink(id: string): Promise<EmailResponse> {
    const user = await this.userService.findById(id);

    if (user.isVerified) {
      throw new HttpException(
        'email already confirmed',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.sendVerificationLink(id, user.email);
  }

  confirmEmail(id: string): Promise<User> {
    return this.userService.markAsVerified(id);
  }

  async decodeVerificationToken(
    token: string,
  ): Promise<VerificationTokenPayload> {
    return this.jwtService
      .verifyAsync<VerificationTokenPayload>(token, {
        publicKey: this.config.get('JWT_VERIFICATION_PUBLIC_KEY'),
      })
      .catch(() => {
        throw new HttpException(
          'invalid verification token',
          HttpStatus.BAD_REQUEST,
        );
      });
  }
}
