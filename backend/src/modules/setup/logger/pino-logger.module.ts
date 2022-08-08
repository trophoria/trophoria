import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const isProduction = config.get('NODE_ENV') === 'production';

        const pinoPrettyTransport = {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'dd/mm/yyyy HH:MM:ss',
            ignore: 'pid,hostname',
            singleLine: true,
          },
        };

        return {
          pinoHttp: {
            level: isProduction ? 'info' : 'debug',
            transport: !isProduction ? pinoPrettyTransport : undefined,
          },
        };
      },
    }),
  ],
})
export class PinoLoggerModule {}
