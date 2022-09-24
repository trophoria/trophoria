import sgMail from '@sendgrid/mail';

import { Mail } from '@trophoria/modules/email/entity/mail.model';

export const extractTokenFromSendArguments = () => {
  const tokenRegex = /\?token=([^"]*)/gm;
  const calledWith: Mail = (sgMail.send as jest.Mock).mock.calls[0][0];
  return tokenRegex.exec(calledWith.html)[1];
};
