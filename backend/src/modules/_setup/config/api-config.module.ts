import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TrophoriaConfig } from '@trophoria/libs/core';
import { ApiConfigService } from '@trophoria/modules/_setup/config/api-config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: (() => {
        if (process.env.NODE_ENV) {
          return TrophoriaConfig.testEnvFilePath;
        }
        return TrophoriaConfig.envFilePath;
      })(),
      validate: TrophoriaConfig.envValidationSchema.parse,
    }),
  ],
  providers: [ApiConfigService],
  exports: [ApiConfigService],
})
export class ApiConfigModule {}