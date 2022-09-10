import { EmailResponse } from '@trophoria/modules/email/entity/model/email-response.model';
import { Mail } from '@trophoria/modules/email/entity/model/mail.model';

/** Symbol to inject the email service. */
export const EmailServiceSymbol = Symbol('EmailService');

/**
 * Service which handles sending of emails.
 */
export interface EmailService {
  /**
   * Sends an email from the in env file configured sender with the
   * in parameter provided html content.
   *
   * @param mail The configuration of the email which should get send
   */
  send(mail: Mail): Promise<EmailResponse>;
}
