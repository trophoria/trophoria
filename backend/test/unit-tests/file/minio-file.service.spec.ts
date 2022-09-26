import { createMock } from '@golevelup/ts-jest';
import { HttpException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { Client } from 'minio';
import { MinioService } from 'nestjs-minio-client';
import { ApiConfigModule } from '@trophoria/modules/_setup/config/api-config.module';
import { ApiConfigService } from '@trophoria/modules/_setup/config/api-config.service';
import {
  FileService,
  FileServiceSymbol,
} from '@trophoria/modules/file/business/file.service';
import { FileModule } from '@trophoria/modules/file/file.module';

const minioClient = {
  bucketExists: jest.fn(async (name) => name === 'existing'),
  makeBucket: jest.fn(),
  setBucketPolicy: jest.fn(),
  putObject: jest.fn(async (bucket) => {
    if (bucket === 'error') return Promise.reject('invalid');
    return null;
  }),
  removeObject: jest.fn(async (bucket, name) => {
    if (bucket === 'invalid' || name === 'invalid') {
      return Promise.reject('invalid');
    }
    return null;
  }),
};

const clientMock = jest
  .spyOn(MinioService.prototype, 'client', 'get')
  .mockImplementation(() => createMock<Client>(minioClient));

describe('MinioFileService', () => {
  let service: FileService;
  let config: ApiConfigService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ApiConfigModule, FileModule],
    }).compile();

    service = moduleRef.get<FileService>(FileServiceSymbol);
    config = moduleRef.get<ApiConfigService>(ApiConfigService);
    clientMock.mockClear();
  });

  afterEach(jest.clearAllMocks);

  it('should be defined', async () => {
    expect(service).toBeDefined();
    expect(config).toBeDefined();
  });

  describe('should create public buckets', () => {
    it('should create public bucket if not exist', async () => {
      await service.createReadOnlyBucket('not_existing');

      expect(minioClient.bucketExists).toBeCalledTimes(1);
      expect(minioClient.makeBucket).toBeCalledTimes(1);
      expect(minioClient.setBucketPolicy).toBeCalledTimes(1);

      expect(minioClient.makeBucket).toHaveBeenCalledWith(
        'not_existing',
        expect.any(String),
      );

      expect(minioClient.setBucketPolicy).toHaveBeenCalledWith(
        'not_existing',
        expect.stringContaining('GetObject'),
      );
    });

    it('should not create bucket if it already exists', async () => {
      await service.createReadOnlyBucket('existing');

      expect(minioClient.bucketExists).toBeCalledTimes(1);
      expect(minioClient.makeBucket).toBeCalledTimes(0);
      expect(minioClient.setBucketPolicy).toBeCalledTimes(0);
    });
  });

  describe('should save files to bucket', () => {
    it('should save the file under provided name', async () => {
      const mockFile = {
        mimetype: 'image/png',
        buffer: Buffer.from('test image'),
      };

      const url = await service.save({
        bucket: 'test',
        file: mockFile,
        name: 'test-file',
      });

      expect(minioClient.putObject).toHaveBeenCalledWith(
        'test',
        'test-file.png',
        expect.any(Buffer),
        expect.objectContaining({ 'Content-Type': 'image/png' }),
      );

      expect(url).toMatch(/.*:\d*\/test\/test-file\.png/);
    });

    it('should generate uuid if not name provided', async () => {
      const mockFile = {
        mimetype: 'image/png',
        buffer: Buffer.from('test image'),
      };

      const url = await service.save({
        bucket: 'test',
        file: mockFile,
      });

      expect(minioClient.putObject).toHaveBeenCalledWith(
        'test',
        expect.not.stringContaining('test image'),
        expect.any(Buffer),
        expect.objectContaining({ 'Content-Type': 'image/png' }),
      );

      expect(url).toMatch(
        /.*:\d*\/test\/[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}\.png/,
      );
    });

    it('should throw error if bucket does not exist', async () => {
      const mockFile = {
        mimetype: 'image/png',
        buffer: Buffer.from('test image'),
      };

      try {
        await service.save({ bucket: 'error', file: mockFile });
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.getStatus()).toBe(400);
      }
    });
  });

  describe('should delete files from bucket', () => {
    it('should delete the named file inside the bucket', async () => {
      await service.delete('test-file.png', 'test-bucket');

      expect(minioClient.removeObject).toHaveBeenCalledWith(
        'test-bucket',
        'test-file.png',
      );
    });

    it('should throw error if bucket / file name is invalid', async () => {
      try {
        await service.delete('test-file.png', 'invalid');
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.getStatus()).toBe(400);
      }
    });
  });
});
