import { SaveInput } from '@trophoria/modules/file/entity/save-input.model';

/** Symbol to inject the file service. */
export const FileServiceSymbol = Symbol('FileService');

/**
 * Service which handles saving, deleting and retrieving of files.
 */
export interface FileService {
  /**
   * Saves the provided file under in the bucket with the provided
   * bucket name. If something went wrong while saving, a
   * {@link HttpException} gets thrown.
   *
   * @param object      Information of the object which should get saved. Look
   *                    at the {@link SaveInput} for more information.
   * @throws            {@link HttpException} if saving went wrong
   * @returns           The public url of saved file
   */
  save(object: SaveInput): Promise<string>;

  /**
   * Deletes any object with the provided object name inside the bucket
   * with the provided bucket name. If the file was not found or could
   * not get deleted, a {@link HttpException} gets thrown.
   *
   * @param objectName  The name of the object to delete
   * @param bucketName  The name of the bucket to delete the object in
   * @throws            {@link HttpException} if file does not exist
   */
  delete(objectName: string, bucketName: string): Promise<void>;

  /**
   * Creates a bucket / folder with the provided name with public read privileges.
   * This means, that the content of the folder is accessible by public if they
   * have the link to the file. This can be useful to access image files from any
   * frontend (like avatars or other static images which are not included into the frontend
   * build). If the bucket / folder does already exist, nothing happens.
   *
   * @param bucketName  The name of the bucket to create.
   */
  createReadOnlyBucket(bucketName: string): Promise<void>;
}
