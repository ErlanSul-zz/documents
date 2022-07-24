import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreditCardsEntity } from './credit-cards.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import express from 'express';
import { getUserSession } from '../global.helpers';
import { CreditCardsUpdateDto } from './dto/credit-cards-update.dto';
import { DOCUMENT_STATUS } from '../status/constants/enum.constants';

@Injectable()
export class CreditCardsService {
  constructor(
    @InjectRepository(CreditCardsEntity)
    private readonly creditCardsRepository: Repository<CreditCardsEntity>,
    private readonly usersService: UsersService,
  ) {}

  async findOneByAuthor(req: express.Request): Promise<CreditCardsEntity> {
    const sessionUserData = getUserSession(req);
    const user = await this.usersService.getAllDocuments(sessionUserData.id);
    if (user === null || user.creditCardsId === null) {
      throw new HttpException(
        'User or credit card not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return user.creditCardsId;
  }

  async create(
    req: express.Request,
    creditCardsDto: CreditCardsUpdateDto,
  ): Promise<CreditCardsEntity> {
    const sessionUserData = getUserSession(req);
    const user = await this.usersService.getAllDocuments(sessionUserData.id);

    if (user === null || user.creditCardsId !== null) {
      throw new HttpException(
        'User not found or user already has the document',
        HttpStatus.NOT_FOUND,
      );
    }
    const creditCardsModel = new CreditCardsEntity(creditCardsDto);
    const creditCard = await this.creditCardsRepository.save(creditCardsModel);

    await this.usersService.update({
      id: sessionUserData.id,
      creditCardsId: creditCard,
    });
    return creditCard;
  }

  async update(
    req: express.Request,
    creditCardsDto: CreditCardsUpdateDto,
  ): Promise<Partial<CreditCardsEntity>> {
    const sessionUserData = getUserSession(req);
    const user = await this.usersService.getAllDocuments(sessionUserData.id);
    const creditCardsModel = new CreditCardsEntity({
      ...user.creditCardsId,
      ...creditCardsDto,
    });

    if (user.creditCardsId === null) {
      throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
    }
    if (creditCardsModel.status === DOCUMENT_STATUS.VERIFIED) {
      throw new HttpException(
        'The verified document cannot be changed',
        HttpStatus.NOT_FOUND,
      );
    }
    return await this.creditCardsRepository.save(creditCardsModel);
  }

  async changeStatus(
    id: number,
    status: DOCUMENT_STATUS,
  ): Promise<CreditCardsEntity> {
    const creditCard = await this.creditCardsRepository.findOneBy({ id });

    if (creditCard === null || status === creditCard.status) {
      throw new HttpException(
        `Document not found or document status already ${status}`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.creditCardsRepository.update({ id }, { status });
    return await this.creditCardsRepository.findOneBy({ id });
  }

  async checkData(id: number): Promise<CreditCardsEntity> {
    return await this.creditCardsRepository
      .createQueryBuilder('creditCards')
      .where({ id })
      .andWhere('"creditCards" IS NOT NULL')
      .getOne();
  }
}
