import { globalGraphQlThrottlerGuard } from '@trophoria/core/guards/graphql-throttler.guard';
import { PersonModule } from '@trophoria/modules/person/person.module';
import { SetupModules } from '@trophoria/modules/setup';
import { PrismaService } from '@trophoria/modules/setup/prisma/prisma.service';

export const Modules = [...SetupModules, PersonModule];

export const Providers = [PrismaService, globalGraphQlThrottlerGuard];
