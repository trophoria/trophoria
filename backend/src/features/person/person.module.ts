import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PersonResolver } from './person.resolver';

@Module({
  providers: [PersonResolver, PrismaService],
})
export class PersonModule {}
