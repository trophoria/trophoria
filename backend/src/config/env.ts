import { ConfigModule } from '@nestjs/config';

export const EnvironmentModule = ConfigModule.forRoot({
  envFilePath: 'config/env/.env',
});
