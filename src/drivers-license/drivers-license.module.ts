import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { DriversLicenseService } from './drivers-license.service';
import { DriversLicenseController } from './drivers-license.controller';
import { DriversLicenseEntity } from './drivers-license.entity';

@Module({
  providers: [DriversLicenseService],
  controllers: [DriversLicenseController],
  exports: [DriversLicenseService],
  imports: [TypeOrmModule.forFeature([DriversLicenseEntity]), UsersModule],
})
export class DriversLicenseModule {}
