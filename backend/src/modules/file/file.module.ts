import { Module } from '@nestjs/common';

import { MinioModule } from 'nestjs-minio-client';
import { ApiConfigService } from '@trophoria/modules/_setup/config/api-config.service';
import { FileServiceSymbol } from '@trophoria/modules/file/business/file.service';
import { MinioClientService } from '@trophoria/modules/file/business/minio-file.service';

@Module({
  providers: [{ provide: FileServiceSymbol, useClass: MinioClientService }],
  exports: [FileServiceSymbol],
  imports: [
    MinioModule.registerAsync({
      inject: [ApiConfigService],
      useFactory: async (configService: ApiConfigService) => ({
        endPoint: configService.get('MINIO_HOST'),
        port: configService.get<number>('MINIO_PORT'),
        accessKey: configService.get('MINIO_ACCESS_KEY'),
        secretKey: configService.get('MINIO_SECRET_KEY'),
        useSSL: configService.isProduction,
      }),
    }),
  ],
})
export class FileModule {}
