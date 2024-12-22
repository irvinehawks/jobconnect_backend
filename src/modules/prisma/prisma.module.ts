/* eslint-disable prettier/prettier */
// prisma.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Export to make it available to other modules
})
export class PrismaModule {}