import { Injectable } from '@nestjs/common';
import sgMail from '@sendgrid/mail';

import { ApiConfigService } from '@trophoria/modules/_setup/config/api-config.service';
import { EmailService } from '@trophoria/modules/email/business/email.service';
import { EmailResponse } from '@trophoria/modules/email/entity/email-response.model';
import { Mail } from '@trophoria/modules/email/entity/mail.model';

@Injectable()
export class SendgridService implements EmailService {
  constructor(private readonly config: ApiConfigService) {
    sgMail.setApiKey(config.get('SEND_GRID_KEY'));
  }

  async send(mail: Mail): Promise<EmailResponse> {
    return sgMail.send({
      ...mail,
      from: {
        email: this.config.get('SEND_GRID_SENDER_MAIL'),
        name: this.config.get('SEND_GRID_SENDER_NAME'),
      },
    })[0];
  }
}
