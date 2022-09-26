import { createMock } from '@golevelup/ts-jest';
import { HttpException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { Client } from 'minio';
import { MinioService } from 'nestjs-minio-client';
import { ApiConfigModule } from '@trophoria/modules/_setup/config/api-config.module';
import {
  FileService,
  FileServiceSymbol,
} from '@trophoria/modules/file/business/file.service';
import { FileModule } from '@trophoria/modules/file/file.module';
import { FileMock } from '@trophoria/test/mocks/file.mock';

const throwIfInvalidBucket = async (bucket: string) =>
  bucket === FileMock.invalidBucketName ? Promise.reject('invalid') : null;

const minioClient = {
  bucketExists: jest.fn(async (name) => name === FileMock.existingBucketName),
  makeBucket: jest.fn(),
  setBucketPolicy: jest.fn(),
  putObject: jest.fn(throwIfInvalidBucket),
  removeObject: jest.fn(throwIfInvalidBucket),
};

jest
  .spyOn(MinioService.prototype, 'client', 'get')
  .mockImplementation(() => createMock<Client>(minioClient));

describe('MinioFileService', () => {
  let service: FileService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ApiConfigModule, FileModule],
    }).compile();

    service = moduleRef.get<FileService>(FileServiceSymbol);
  });

  afterEach(jest.clearAllMocks);

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  describe('should create public buckets', () => {
    it('should create public bucket if not exist', async () => {
      await service.createReadOnlyBucket(FileMock.newBucketName);

      expect(minioClient.bucketExists).toBeCalledTimes(1);
      expect(minioClient.makeBucket).toBeCalledTimes(1);
      expect(minioClient.setBucketPolicy).toBeCalledTimes(1);

      expect(minioClient.makeBucket).toHaveBeenCalledWith(
        FileMock.newBucketName,
        expect.any(String),
      );

      expect(minioClient.setBucketPolicy).toHaveBeenCalledWith(
        FileMock.newBucketName,
        expect.stringContaining('GetObject'),
      );
    });

    it('should not create bucket if it already exists', async () => {
      await service.createReadOnlyBucket(FileMock.existingBucketName);

      expect(minioClient.bucketExists).toBeCalledTimes(1);
      expect(minioClient.makeBucket).toBeCalledTimes(0);
      expect(minioClient.setBucketPolicy).toBeCalledTimes(0);
    });
  });

  describe('should save files to bucket', () => {
    it('should save the file under provided name', async () => {
      const url = await service.save({
        bucket: FileMock.newBucketName,
        file: FileMock.testFile,
        name: FileMock.testFileName,
      });

      expect(minioClient.putObject).toHaveBeenCalledWith(
        FileMock.newBucketName,
        `${FileMock.testFileName}.png`,
        expect.any(Buffer),
        expect.objectContaining({ 'Content-Type': FileMock.testFile.mimetype }),
      );

      expect(url).toMatch(
        new RegExp(
          `.*:\\d*/${FileMock.newBucketName}/${FileMock.testFileName}\\.png`,
        ),
      );
    });

    it('should generate uuid if not name provided', async () => {
      const url = await service.save({
        bucket: FileMock.existingBucketName,
        file: FileMock.testFile,
      });

      expect(minioClient.putObject).toHaveBeenCalledWith(
        FileMock.existingBucketName,
        expect.not.stringContaining(FileMock.testFileName),
        expect.any(Buffer),
        expect.objectContaining({ 'Content-Type': FileMock.testFile.mimetype }),
      );

      expect(url).toMatch(
        new RegExp(
          `.*:\\d*\\/${FileMock.existingBucketName}\\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\\.png`,
        ),
      );
    });

    it('should throw error if bucket does not exist', async () => {
      try {
        await service.save({
          bucket: FileMock.invalidBucketName,
          file: FileMock.testFile,
        });
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.getStatus()).toBe(400);
      }
    });
  });

  describe('should delete files from bucket', () => {
    it('should delete the named file inside the bucket', async () => {
      await service.delete(
        FileMock.testFileNameWithExtension,
        FileMock.existingBucketName,
      );

      expect(minioClient.removeObject).toHaveBeenCalledWith(
        FileMock.existingBucketName,
        FileMock.testFileNameWithExtension,
      );
    });

    it('should throw error if bucket / file name is invalid', async () => {
      try {
        await service.delete(
          FileMock.invalidFileName,
          FileMock.invalidBucketName,
        );
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.getStatus()).toBe(400);
      }
    });
  });
});
