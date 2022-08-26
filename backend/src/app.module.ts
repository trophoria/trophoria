import { Module } from '@nestjs/common';

import { HealthModule } from '@trophoria/modules/_health/health.module';
import { SetupModule } from '@trophoria/modules/_setup/setup.module';
import { UserModule } from '@trophoria/modules/user/user.module';

@Module({
  imports: [SetupModule, HealthModule, UserModule],
})
export class AppModule {}
