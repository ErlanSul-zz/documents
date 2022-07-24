import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import express from 'express';
import { getUserSession } from '../global.helpers';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { DriversLicenseEntity } from './drivers-license.entity';
import { DriversLicenseUpdateDto } from './dto/drivers-license-update.dto';
import { DOCUMENT_STATUS } from '../status/constants/enum.constants';

@Injectable()
export class DriversLicenseService {
  constructor(
    @InjectRepository(DriversLicenseEntity)
    private readonly driversLicenseRepository: Repository<DriversLicenseEntity>,
    private readonly usersService: UsersService,
  ) {}

  async findOneByAuthor(req: express.Request): Promise<DriversLicenseEntity> {
    const sessionUserData = getUserSession(req);
    const user = await this.usersService.getAllDocuments(sessionUserData.id);
    if (user === null || user.driversLicenseId === null) {
      throw new HttpException(
        'User or credit card not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return user.driversLicenseId;
  }

  async create(
    req: express.Request,
    driversLicenseDto: DriversLicenseUpdateDto,
  ): Promise<DriversLicenseEntity> {
    const sessionUserData = getUserSession(req);
    const user = await this.usersService.getAllDocuments(sessionUserData.id);

    if (user === null || user.driversLicenseId !== null) {
      throw new HttpException(
        'User not found or user already has the document',
        HttpStatus.NOT_FOUND,
      );
    }
    const driversLicenseModel = new DriversLicenseEntity(driversLicenseDto);
    const driversLicense = await this.driversLicenseRepository.save(
      driversLicenseModel,
    );

    await this.usersService.update({
      id: sessionUserData.id,
      driversLicenseId: driversLicense,
    });
    return driversLicense;
  }

  async update(
    req: express.Request,
    driversLicenseDto: DriversLicenseUpdateDto,
  ): Promise<Partial<DriversLicenseEntity>> {
    const sessionUserData = getUserSession(req);
    const user = await this.usersService.getAllDocuments(sessionUserData.id);
    const driversLicenseModel = new DriversLicenseEntity({
      ...user.driversLicenseId,
      ...driversLicenseDto,
    });

    if (user.driversLicenseId === null) {
      throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
    }

    if (driversLicenseModel.status === DOCUMENT_STATUS.VERIFIED) {
      throw new HttpException(
        'The verified document cannot be changed',
        HttpStatus.NOT_FOUND,
      );
    }
    return await this.driversLicenseRepository.save(driversLicenseModel);
  }

  async changeStatus(
    id: number,
    status: DOCUMENT_STATUS,
  ): Promise<DriversLicenseEntity> {
    const driversLicense = await this.driversLicenseRepository.findOneBy({
      id,
    });

    if (driversLicense === null || status === driversLicense.status) {
      throw new HttpException(
        `Document not found or document status already ${status}`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.driversLicenseRepository.update({ id }, { status });
    return await this.driversLicenseRepository.findOneBy({ id });
  }

  async checkData(id: number): Promise<DriversLicenseEntity> {
    return await this.driversLicenseRepository
      .createQueryBuilder('driversLicense')
      .where({ id })
      .andWhere('"driversLicense" IS NOT NULL')
      .getOne();
  }
}
