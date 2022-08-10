import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';

import {
  PrismaHealthIndicator,
  DisableThrottler,
} from '@trophoria/libs/common';

@Controller('')
@DisableThrottler()
export class HealthController {
  constructor(
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
    return this.health.check([
      () => this.http.pingCheck('endpoint', 'http://127.0.0.1:3000/ping'),
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
