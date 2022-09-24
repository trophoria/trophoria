import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { v4 as idv4 } from 'uuid';

import { ApiConfigService } from '@trophoria/modules/_setup/config/api-config.service';
import { FileService } from '@trophoria/modules/file/business/file.service';
import { SaveInput } from '@trophoria/modules/file/entity/save-input.model';

@Injectable()
export class MinioClientService implements FileService {
  constructor(
    private readonly minioService: MinioService,
    private readonly config: ApiConfigService,
  ) {
    this.createReadOnlyBucket('avatars');
  }

  async save({ bucket, file, name }: SaveInput): Promise<string> {
    const extension = file.mimetype.split('/')[1];
    const metaData = { 'Content-Type': file.mimetype };
    const fileName = (name ?? idv4()) + `.${extension}`;

    await this.storage
      .putObject(bucket, fileName, file.buffer, metaData)
      .catch(() => {
        throw new HttpException('could not save file', HttpStatus.BAD_REQUEST);
      });

    return `${this.config.get('MINIO_HOST')}:${this.config.get(
      'MINIO_PORT',
    )}/${bucket}/${fileName}`;
  }

  async delete(objectName: string, bucketName: string): Promise<void> {
    await this.storage.removeObject(bucketName, objectName).catch(() => {
      throw new HttpException('could not delete file', HttpStatus.BAD_REQUEST);
    });
  }

  private get storage() {
    return this.minioService.client;
  }

  private async createReadOnlyBucket(bucketName: string): Promise<void> {
    const publicPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicRead',
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject', 's3:GetObjectVersion'],
          Resource: ['arn:aws:s3:::avatars/*'],
        },
      ],
    };

    if (!(await this.storage.bucketExists('avatars'))) {
      await this.storage.makeBucket('avatars', 'eu-west-1');
      await this.storage.setBucketPolicy(
        'avatars',
        JSON.stringify(publicPolicy),
      );
    }
  }
}
