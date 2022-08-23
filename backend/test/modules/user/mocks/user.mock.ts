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

  static mockTokens = ['42', '31'];
  static mockToken = '42';
}
