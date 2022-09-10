/**
 * The response of the mail client after an attempt to send
 * the email.
 *
 * @param statusCode  The status code of the request
 * @param body        The body data of the request
 * @param headers     The header data of the request
 */
export type EmailResponse = {
  statusCode: number;
  body: unknown;
  headers: unknown;
};
