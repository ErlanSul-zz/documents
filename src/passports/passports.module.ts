import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { PassportsService } from './passports.service';
import { PassportsController } from './passports.controller';
import { PassportsEntity } from './passports.entity';

@Module({
  providers: [PassportsService],
  controllers: [PassportsController],
  exports: [PassportsService],
  imports: [TypeOrmModule.forFeature([PassportsEntity]), UsersModule],
})
export class PassportsModule {}
