import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '@trophoria/graphql/user/user.model';
import { ApiConfigService } from '@trophoria/modules/_setup/config/api-config.service';
import { PasswordResetService } from '@trophoria/modules/auth/modules/passwordReset/business/password-reset.service';
import { PasswordResetTokenPayload } from '@trophoria/modules/auth/modules/passwordReset/entity/password-reset-token-payload.model';
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
export class PasswordResetDatabaseService implements PasswordResetService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ApiConfigService,
    @Inject(EmailServiceSymbol) private readonly emailService: EmailService,
    @Inject(UserServiceSymbol) private readonly userService: UserService,
  ) {}

  requestPasswordReset(email: string): Promise<EmailResponse> {
    const resetPasswordToken = this.jwtService.sign(
      { email },
      {
        subject: email,
        privateKey: this.config.get<string>('JWT_PASSWORD_RESET_PRIVATE_KEY'),
        expiresIn: this.config.get<string>('JWT_PASSWORD_RESET_EXPIRES_IN'),
      },
    );

    const url = `${this.config.get(
      'PASSWORD_RESET_URL',
    )}?token=${resetPasswordToken}`;

    const content = `To reset your password, <a href="${url}">click here</a>!`;

    return this.emailService.send({
      to: email,
      subject: 'Password reset',
      html: content,
    });
  }

  async resetPassword(email: string, newPassword: string): Promise<User> {
    return this.userService.update({ email }, { password: newPassword });
  }

  async decodePasswordResetToken(
    token: string,
  ): Promise<PasswordResetTokenPayload> {
    return this.jwtService
      .verifyAsync<PasswordResetTokenPayload>(token, {
        publicKey: this.config.get('JWT_PASSWORD_RESET_PUBLIC_KEY'),
      })
      .catch(() => {
        throw new HttpException(
          'invalid password reset token',
          HttpStatus.BAD_REQUEST,
        );
      });
  }
}
