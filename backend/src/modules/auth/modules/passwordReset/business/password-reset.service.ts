import { User } from '@trophoria/graphql/user/user.model';
import { PasswordResetTokenPayload } from '@trophoria/modules/auth/modules/passwordReset/entity/password-reset-token-payload.model';
import { EmailResponse } from '@trophoria/modules/email/entity/email-response.model';

/** Symbol to inject the password reset service. */
export const PasswordResetSymbol = Symbol('ResetPassword');

/**
 * Service to provide functions for password reset
 */
export interface PasswordResetService {
  /**
   * Sends the password reset request to the provided url. The sent
   * email contains a jwt token encoded with this email.
   *
   * @param email   The email to send the password reset to
   * @returns       The response of the email client
   */
  requestPasswordReset(email: string): Promise<EmailResponse>;

  /**
   * Confirms the email of the user if it's not already confirmed.
   *
   * @param email         The email to send the password reset to
   * @param newPassword   The new password to save to the user
   * @returns             The updated user instance
   */
  resetPassword(email: string, newPassword: string): Promise<User>;

  /**
   * Decodes the provided reset password token into its payload. If the
   * token is invalid or expired, an error gets thrown.
   *
   * @param token The reset password token
   * @throws      {@link HttpException} if token is invalid or expired
   * @returns     The decoded token payload
   */
  decodePasswordResetToken(token: string): Promise<PasswordResetTokenPayload>;
}
