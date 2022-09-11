import { Injectable } from '@nestjs/common';
import sgMail from '@sendgrid/mail';

import { ApiConfigService } from '@trophoria/modules/_setup/config/api-config.service';
import { EmailService } from '@trophoria/modules/email/business/email.service';
import { EmailResponse } from '@trophoria/modules/email/entity/model/email-response.model';
import { Mail } from '@trophoria/modules/email/entity/model/mail.model';

@Injectable()
export class SendgridService implements EmailService {
  constructor(private readonly configService: ApiConfigService) {
    sgMail.setApiKey(configService.get('SEND_GRID_KEY'));
  }

  async send(mail: Mail): Promise<EmailResponse> {
    return sgMail.send({
      ...mail,
      from: this.configService.get('SEND_GRID_SENDER'),
    })[0];
  }
}
