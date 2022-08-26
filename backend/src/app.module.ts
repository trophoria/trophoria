import { Module } from '@nestjs/common';

import { HealthModule } from '@trophoria/modules/_health/health.module';
import { SetupModule } from '@trophoria/modules/_setup/setup.module';
import { AuthModule } from '@trophoria/modules/auth/auth.module';
import { UserModule } from '@trophoria/modules/user/user.module';

@Module({
  imports: [SetupModule, HealthModule, UserModule, AuthModule],
})
export class AppModule {}
