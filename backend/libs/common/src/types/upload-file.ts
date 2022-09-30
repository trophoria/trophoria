import { StorageFile } from '@blazity/nest-file-fastify';

export interface UploadFile extends StorageFile {
  buffer: Buffer;
}
