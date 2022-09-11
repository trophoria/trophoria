import { User } from '@trophoria/graphql';
import { VerificationTokenPayload } from '@trophoria/modules/auth/modules/emailConfirmation/entity/model/verification-token-payload.model';
import { EmailResponse } from '@trophoria/modules/email/entity/model/email-response.model';

/** Symbol to inject the email confirmation service. */
export const EmailConfirmationSymbol = Symbol('EmailConfirmation');

/**
 * Service to provide functions for email confirmation.
 */
export interface EmailConfirmationService {
  /**
   * Sends the verification link to the provided email. The link contains
   * a freshly signed token containing the user id.
   *
   * @param id      The id of the user which gets encoded in token payload
   * @param email   The email to send the verification link to
   * @returns       The response of the email client
   */
  sendVerificationLink(id: string, email: string): Promise<EmailResponse>;

  /**
   * Resend's the verification link of the user with the provided id. If
   * the user is already confirmed, no email gets send amd an error gets
   * thrown.
   *
   * @param id    The id of the user to send the verification link to
   * @throws      {@link HttpException} if user already verified
   * @returns     The response of the email client
   */
  resendConfirmationLink(id: string): Promise<EmailResponse>;

  /**
   * Confirms the email of the user if it's not already confirmed.
   *
   * @param id   The id of the user to confirm its email
   * @returns    The updated user instance
   */
  confirmEmail(id: string): Promise<User>;

  /**
   * Decodes the provided verification token into its payload. If the
   * token is invalid or expired, an error gets thrown.
   *
   * @param token The verification token
   * @throws      {@link HttpException} if token is invalid or expired
   * @returns     The decoded token payload
   */
  decodeVerificationToken(token: string): Promise<VerificationTokenPayload>;
}
