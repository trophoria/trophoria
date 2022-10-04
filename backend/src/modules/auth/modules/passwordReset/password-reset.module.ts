import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PasswordResetResolver } from '@trophoria/modules/auth/modules/passwordReset/boundary/password-reset.resolver';

import { PasswordResetDatabaseService } from '@trophoria/modules/auth/modules/passwordReset/business/password-reset-database.service';
import { PasswordResetSymbol } from '@trophoria/modules/auth/modules/passwordReset/business/password-reset.service';
import { EmailModule } from '@trophoria/modules/email/email.module';
import { UserModule } from '@trophoria/modules/user/user.module';

@Module({
  imports: [
    EmailModule,
    UserModule,
    JwtModule.register({
      signOptions: { algorithm: 'ES256', issuer: 'https://trophoria.com' },
    }),
  ],
  providers: [
    {
      provide: PasswordResetSymbol,
      useClass: PasswordResetDatabaseService,
    },
    PasswordResetResolver,
  ],
  exports: [PasswordResetSymbol],
})
export class PasswordResetModule {}
