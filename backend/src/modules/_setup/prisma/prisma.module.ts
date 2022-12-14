import { Global, Module } from '@nestjs/common';

import { PrismaService } from '@trophoria/modules/_setup/prisma/prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
