import { Module } from '@nestjs/common';

import { HealthModule } from '@trophoria/modules/_health/health.module';
import { SetupModule } from '@trophoria/modules/_setup/setup.module';
import { AuthModule } from '@trophoria/modules/auth/auth.module';
import { EmailConfirmationModule } from '@trophoria/modules/auth/modules/emailConfirmation/email-confirmation.module';
import { EmailModule } from '@trophoria/modules/email/email.module';
import { UserModule } from '@trophoria/modules/user/user.module';

@Module({
  imports: [
    SetupModule,
    HealthModule,
    UserModule,
    AuthModule,
    EmailModule,
    EmailConfirmationModule,
  ],
})
export class AppModule {}
