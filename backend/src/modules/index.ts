import { globalGraphQlThrottlerGuard } from '@trophoria/core/guards/graphql-throttler.guard';
import { HealthModule } from '@trophoria/modules/health/health.module';
import { SetupModules } from '@trophoria/modules/setup';
import { PrismaService } from '@trophoria/modules/setup/prisma/prisma.service';

export const Modules = [...SetupModules, HealthModule];
export const Providers = [PrismaService, globalGraphQlThrottlerGuard];
