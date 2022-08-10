import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TrophoriaConfig } from '@trophoria/libs/core';
import { ApiConfigService } from '@trophoria/modules/setup/config/api-config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: TrophoriaConfig.envFilePath,
      validate: TrophoriaConfig.envValidationSchema.parse,
    }),
  ],
  providers: [ApiConfigService],
  exports: [ApiConfigService],
})
export class ApiConfigModule {}
