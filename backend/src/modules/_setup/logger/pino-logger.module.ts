import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { ApiConfigService } from '@trophoria/modules/_setup/config/api-config.service';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [ApiConfigService],
      useFactory: async (config: ApiConfigService) => {
        const pinoPrettyTransport = {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'dd/mm/yyyy HH:MM:ss',
            ignore: 'pid,hostname',
            singleLine: true,
          },
        };

        const getLevel = () => {
          if (config.isTest) return 'silent';
          return config.isProduction ? 'info' : 'debug';
        };

        return {
          pinoHttp: {
            level: getLevel(),
            transport: !config.isProduction ? pinoPrettyTransport : undefined,
          },
        };
      },
    }),
  ],
})
export class PinoLoggerModule {}
