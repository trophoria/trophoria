import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get(key: string) {
    return this.configService.get(key);
  }

  get isProduction() {
    return this.configService.get('NODE_ENV') === 'production';
  }

  get isTest() {
    return this.configService.get('NODE_ENV') === 'test';
  }

  get databaseUrl() {
    const user = this.configService.get('DATABASE_USER');
    const password = this.configService.get('DATABASE_PASSWORD');
    const host = this.configService.get('DATABASE_HOST');
    const port = this.configService.get('DATABASE_PORT');
    const db = this.configService.get('DATABASE_DB');

    return `postgresql://${user}:${password}@${host}:${port}/${db}`;
  }
}
