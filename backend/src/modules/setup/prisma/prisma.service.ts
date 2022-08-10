import {
  INestApplication,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ApiConfigService } from '@trophoria/modules/setup/config/api-config.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private config: ApiConfigService) {
    super({ datasources: { db: { url: config.databaseUrl } } });
  }

  async onModuleInit() {
    this.$connect();
  }

  async onModuleDestroy() {
    this.$disconnect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => app.close());
  }

  async cleanDatabase() {
    if (this.config.isProduction) return;
    return Promise.all([this.account.deleteMany()]);
  }
}
