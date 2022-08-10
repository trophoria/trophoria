import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { PrismaHealthIndicator } from '@trophoria/libs/common';
import { HealthController } from '@trophoria/modules/health/boundary/health.controller';
import { HealthResolver } from '@trophoria/modules/health/boundary/health.resolver';

@Module({
  imports: [TerminusModule, HttpModule],
  providers: [HealthResolver, PrismaHealthIndicator],
  controllers: [HealthController],
})
export class HealthModule {}
