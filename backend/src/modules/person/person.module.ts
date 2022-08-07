import { Module } from '@nestjs/common';

import { PersonResolver } from '@trophoria/modules/person/person.resolver';
import { PrismaService } from '@trophoria/modules/setup/prisma/prisma.service';

@Module({
  providers: [PersonResolver, PrismaService],
})
export class PersonModule {}
