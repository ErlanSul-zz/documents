import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import express from 'express';
import { getUserSession } from '../global.helpers';
import { PassportsEntity } from './passports.entity';
import { PassportsUpdateDto } from './dto/passports-update.dto';
import { DOCUMENT_STATUS } from '../status/constants/enum.constants';

@Injectable()
export class PassportsService {
  constructor(
    @InjectRepository(PassportsEntity)
    private readonly passportsRepository: Repository<PassportsEntity>,
    private readonly usersService: UsersService,
  ) {}

  async findOneByAuthor(req: express.Request): Promise<PassportsEntity> {
    const sessionUserData = getUserSession(req);
    const user = await this.usersService.getAllDocuments(sessionUserData.id);
    if (user === null || user.passportId === null) {
      throw new HttpException(
        'User or credit card not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return user.passportId;
  }

  async create(
    req: express.Request,
    passportsDto: PassportsUpdateDto,
  ): Promise<PassportsEntity> {
    const sessionUserData = getUserSession(req);
    const user = await this.usersService.getAllDocuments(sessionUserData.id);

    if (user === null || user.passportId !== null) {
      throw new HttpException(
        'User not found or user already has the document',
        HttpStatus.NOT_FOUND,
      );
    }
    const passportsModel = new PassportsEntity(passportsDto);
    const passports = await this.passportsRepository.save(passportsModel);

    await this.usersService.update({
      id: sessionUserData.id,
      passportId: passports,
    });
    return passports;
  }

  async update(
    req: express.Request,
    passportsDto: PassportsUpdateDto,
  ): Promise<Partial<PassportsEntity>> {
    const sessionUserData = getUserSession(req);
    const user = await this.usersService.getAllDocuments(sessionUserData.id);
    const passportsModel = new PassportsEntity({
      ...user.passportId,
      ...passportsDto,
    });

    if (user.passportId === null) {
      throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
    }

    if (passportsModel.status === DOCUMENT_STATUS.VERIFIED) {
      throw new HttpException(
        'The verified document cannot be changed',
        HttpStatus.NOT_FOUND,
      );
    }
    return await this.passportsRepository.save(passportsModel);
  }

  async changeStatus(
    id: number,
    status: DOCUMENT_STATUS,
  ): Promise<PassportsEntity> {
    const passport = await this.passportsRepository.findOneBy({
      id,
    });

    if (passport === null || status === passport.status) {
      throw new HttpException(
        `Document not found or document status already ${status}`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.passportsRepository.update({ id }, { status });
    return await this.passportsRepository.findOneBy({ id });
  }

  async checkData(id: number): Promise<PassportsEntity> {
    return await this.passportsRepository
      .createQueryBuilder('passports')
      .where({ id })
      .andWhere('"passports" IS NOT NULL')
      .getOne();
  }
}
