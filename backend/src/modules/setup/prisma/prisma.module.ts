import { Module } from '@nestjs/common';

import { PrismaService } from '@trophoria/modules/setup/prisma/prisma.service';

@Module({ providers: [PrismaService], exports: [PrismaService] })
export class PrismaModule {}
