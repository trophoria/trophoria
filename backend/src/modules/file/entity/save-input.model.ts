import { File } from '@trophoria/modules/file/entity/file.model';

/** The information needed to create an object. */
export type SaveInput = {
  /** The meta and buffer data of the file */
  file: File;
  /** The name of the bucket to save the file into */
  bucket: string;
  /** The name if the file. If no name is provided, a unique id is generated instead. */
  name?: string;
};
