import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';
import { PassportsModule } from '../passports/passports.module';
import { CreditCardsModule } from '../credit-cards/credit-cards.module';
import { DriversLicenseModule } from '../drivers-license/drivers-license.module';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [StatusService],
  controllers: [StatusController],
  imports: [
    PassportsModule,
    CreditCardsModule,
    DriversLicenseModule,
    UsersModule,
  ],
})
export class StatusModule {}
