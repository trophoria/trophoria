import { Module } from '@nestjs/common';

import { EmailServiceSymbol } from '@trophoria/modules/email/business/email.service';
import { SendgridService } from '@trophoria/modules/email/business/sendgrid.service';

@Module({
  providers: [{ provide: EmailServiceSymbol, useClass: SendgridService }],
  exports: [EmailServiceSymbol],
})
export class EmailModule {}
