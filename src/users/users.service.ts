import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersEntity } from './users.entity';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async findOneByUserName(username: string): Promise<UsersEntity> {
    return await this.usersRepository.findOneBy({ username });
  }

  async findOneByUserId(id: number): Promise<UsersEntity> {
    return await this.usersRepository.findOneBy({ id });
  }

  async getAllDocuments(id: number): Promise<UsersEntity> {
    return await this.usersRepository.findOne({
      select: ['id', 'username', 'documentsConfirmed'],
      relations: ['creditCardsId', 'driversLicenseId', 'passportId'],
      where: { id },
    });
  }

  async getUserDocuments(id: number): Promise<UsersEntity> {
    const user = await this.getAllDocuments(id);
    if (user === null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async update(updateUsersDto: Partial<UsersEntity>): Promise<UpdateResult> {
    const userModel = await this.usersRepository.findOneBy({
      id: updateUsersDto.id,
    });
    if (userModel === null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (Object.entries(updateUsersDto).length === 0) {
      throw new HttpException('User not modified', HttpStatus.NOT_MODIFIED);
    }

    try {
      return await this.usersRepository.update(userModel.id, updateUsersDto);
    } catch (error) {
      throw new HttpException('User not modified', HttpStatus.BAD_REQUEST);
    }
  }
}
