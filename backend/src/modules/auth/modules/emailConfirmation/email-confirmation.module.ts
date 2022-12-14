import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EmailConfirmationResolver } from '@trophoria/modules/auth/modules/emailConfirmation/boundary/email-confirmation.resolver';

import { EmailConfirmationDatabaseService } from '@trophoria/modules/auth/modules/emailConfirmation/business/email-confirmation-database.service';
import { EmailConfirmationSymbol } from '@trophoria/modules/auth/modules/emailConfirmation/business/email-confirmation.service';
import { EmailModule } from '@trophoria/modules/email/email.module';
import { UserModule } from '@trophoria/modules/user/user.module';

@Module({
  imports: [
    EmailModule,
    forwardRef(() => UserModule),
    JwtModule.register({
      signOptions: { algorithm: 'ES256', issuer: 'https://trophoria.com' },
    }),
  ],
  providers: [
    {
      provide: EmailConfirmationSymbol,
      useClass: EmailConfirmationDatabaseService,
    },
    EmailConfirmationResolver,
  ],
  exports: [EmailConfirmationSymbol],
})
export class EmailConfirmationModule {}
