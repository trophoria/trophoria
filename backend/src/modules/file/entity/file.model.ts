/** The file describing the content of a specific file. */
export type File = {
  /** The mimetype of the file (e.g. image/png) */
  mimetype: string;
  /** The image data as byte buffer or as encoded string */
  buffer: Buffer | string;
};
