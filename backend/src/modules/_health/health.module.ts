import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { PrismaHealthIndicator } from '@trophoria/libs/common';
import { HealthController } from '@trophoria/modules/_health/boundary/health.controller';
import { HealthResolver } from '@trophoria/modules/_health/boundary/health.resolver';
import { PrismaModule } from '@trophoria/modules/_setup/prisma/prisma.module';

@Module({
  imports: [TerminusModule, HttpModule, PrismaModule],
  providers: [HealthResolver, PrismaHealthIndicator],
  controllers: [HealthController],
})
export class HealthModule {}
