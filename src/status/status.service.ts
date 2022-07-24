import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportsService } from '../passports/passports.service';
import { DriversLicenseService } from '../drivers-license/drivers-license.service';
import { CreditCardsService } from '../credit-cards/credit-cards.service';
import { UsersService } from '../users/users.service';
import { DOCUMENT_STATUS } from './constants/enum.constants';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersEntity } from '../users/users.entity';
import { CreditCardsEntity } from '../credit-cards/credit-cards.entity';
import { PassportsEntity } from '../passports/passports.entity';
import { DriversLicenseEntity } from '../drivers-license/drivers-license.entity';

@Injectable()
export class StatusService {
  constructor(
    @InjectDataSource('default')
    private readonly defaultConnection: DataSource,
    private readonly passportsService: PassportsService,
    private readonly creditCardsService: CreditCardsService,
    private readonly driversLicenseService: DriversLicenseService,
    private readonly usersService: UsersService,
  ) {}

  async userDocumentVerified(userId: number): Promise<boolean> {
    const user = await this.usersService.getAllDocuments(userId);

    if (
      user === null ||
      user.creditCardsId === null ||
      user.passportId === null ||
      user.driversLicenseId === null
    ) {
      throw new HttpException(
        'User not found or user already has the document',
        HttpStatus.NOT_FOUND,
      );
    }
    if (
      user.creditCardsId.status === DOCUMENT_STATUS.VERIFIED &&
      user.passportId.status === DOCUMENT_STATUS.VERIFIED &&
      user.driversLicenseId.status === DOCUMENT_STATUS.VERIFIED
    ) {
      return true;
    }
    const creditCard = await this.creditCardsService.checkData(
      user.creditCardsId.id,
    );
    const passport = await this.passportsService.checkData(user.passportId.id);
    const driverLicense = await this.driversLicenseService.checkData(
      user.driversLicenseId.id,
    );

    if (creditCard !== null && passport !== null && driverLicense !== null) {
      await this.changeStatusAllVerified(user);
      return true;
    }
    return false;
  }

  async changeStatusAllVerified(userModel: UsersEntity): Promise<void> {
    await this.defaultConnection.transaction(async (entityManager) => {
      await entityManager.getRepository(CreditCardsEntity).save(
        new CreditCardsEntity({
          id: userModel.creditCardsId.id,
          status: DOCUMENT_STATUS.VERIFIED,
        }),
      );
      await entityManager.getRepository(PassportsEntity).save(
        new PassportsEntity({
          id: userModel.passportId.id,
          status: DOCUMENT_STATUS.VERIFIED,
        }),
      );
      await entityManager.getRepository(DriversLicenseEntity).save(
        new DriversLicenseEntity({
          id: userModel.driversLicenseId.id,
          status: DOCUMENT_STATUS.VERIFIED,
        }),
      );
      await entityManager.getRepository(UsersEntity).save(
        new UsersEntity({
          id: userModel.id,
          documentsConfirmed: true,
        }),
      );
    });
  }
}
