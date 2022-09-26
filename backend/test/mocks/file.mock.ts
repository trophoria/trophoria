export class FileMock {
  static testFile = {
    mimetype: 'image/png',
    buffer: Buffer.from('test image'),
  };
  static testFileName = 'test-file';
  static testFileNameWithExtension = `${FileMock.testFileName}.png`;

  static saveMockResponse = 'https://trophoria.com:9000/avatars/1234.png';

  static existingBucketName = 'existing';
  static newBucketName = 'not_existing';
  static invalidBucketName = 'invalid';
}
