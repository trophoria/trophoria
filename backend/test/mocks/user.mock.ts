export class UserMock {
  static mockUsers = [
    {
      email: 'test.user@trophoria.de',
      password: '12345678',
      username: 'TestUser',
    },
    {
      email: 'mock@trophoria.de',
      password: '12345678',
      username: 'MockUser',
    },
    {
      email: 'hello.world@trophoria.de',
      password: 'hello1234',
      username: 'IAmTrophoria',
    },
  ];

  static userWithoutUsername = {
    email: 'unamed.user@trophoria.de',
    password: 'password123',
  };

  static updateUsernameInput = {
    username: 'ChangedUser',
  };

  static updateEmailInput = {
    email: 'updated.user@trophoria.de',
  };

  static updatePasswordInput = {
    password: 'Update1234',
  };

  static mockTokens = ['42', '31'];
  static mockToken = '42';
  static realisticMockToken =
    'eyJhbGciOiJFUzI1NiIsInR5dCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1IiwiaWF0IjoxNjYzOTIyODU2LCJleHAiOjE2NjM5MjY0NTYsImlzcyI6Imh0dHBzOi8vdHJvcGhvcmlhLmNvbSIsInN1YiI6IjEyMzQ1In0.pis-2M6T2UvU_90QFTSaq-zoWJKMi-uYz-wWgOCKJMaRe128q72-3c104ynANf4yYe8_T6ChHKOu6rBB8-h3Kg';
}
