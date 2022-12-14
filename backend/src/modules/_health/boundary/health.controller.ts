import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { ThrottlerGuard } from '@nestjs/throttler';

import { PrismaHealthIndicator } from '@trophoria/libs/common';
import { ApiConfigService } from '@trophoria/modules/_setup/config/api-config.service';

@UseGuards(ThrottlerGuard)
@Controller('health')
export class HealthController {
  constructor(
    private readonly config: ApiConfigService,
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly db: PrismaHealthIndicator,
  ) {}

  @Get('ping')
  ping() {
    return 'pong';
  }

  @Get('check')
  @HealthCheck()
  check() {
    const pingUrl = `http://${this.config.get('API_HOST')}:${this.config.get(
      'API_PORT',
    )}/${this.config.get('API_PREFIX')}/health/ping`;

    return this.health.check([
      () => this.http.pingCheck('endpoint', pingUrl),
      () => this.db.isHealthy('database'),
      () => this.memory.checkHeap('backend_memory', 150 * 1024 * 1024),
      () =>
        this.disk.checkStorage('backend_storage', {
          path: '/',
          thresholdPercent: 0.5,
        }),
    ]);
  }
}
