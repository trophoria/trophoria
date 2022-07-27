import { Module } from '@nestjs/common';

import { EnvironmentModule } from './config/env';
import { GraphQlModule } from './config/graphql';
import { CacheModule } from './config/redis';
import { PersonModule } from './features/person/person.module';
import { PrismaService } from './features/prisma/prisma.service';

@Module({
  imports: [EnvironmentModule, CacheModule, GraphQlModule, PersonModule],
  providers: [PrismaService],
})
export class AppModule {}
