/**
 * The configuration of an mail which should get send.
 *
 * @param to        The email address to send the email to
 * @param subject   The subject (header) of the email
 * @param html      The html content of the email
 */
export type Mail = {
  to: string;
  subject: string;
  html: string;
};
