import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TrophoriaConfig } from '@trophoria/libs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: TrophoriaConfig.envFilePath,
      validate: TrophoriaConfig.envValidationSchema.parse,
    }),
  ],
})
export class ApiConfigModule {}
