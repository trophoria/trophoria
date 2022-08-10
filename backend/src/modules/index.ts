import { HealthModule } from '@trophoria/modules/health/health.module';
import { SetupModules } from '@trophoria/modules/setup';

export const Modules = [...SetupModules, HealthModule];
export const Providers = [];
