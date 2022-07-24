import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreditCardsService } from './credit-cards.service';
import express from 'express';
import { CreditCardsEntity } from './credit-cards.entity';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { CreditCardsUpdateDto } from './dto/credit-cards-update.dto';
import { UserRoles } from '../auth/decorators/roles.decorator';
import { USER_ROLES } from '../users/constants/enum.constants';
import { UserRolesGuard } from '../auth/guards/user-roles.guard';
import { DOCUMENT_STATUS } from '../status/constants/enum.constants';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('credit-cards')
@UseGuards(AuthenticatedGuard, UserRolesGuard)
@ApiTags('credit-cards')
export class CreditCardsController {
  constructor(private readonly creditCardsService: CreditCardsService) {}

  @Get()
  @UserRoles(USER_ROLES.CLIENT)
  @ApiOperation({ summary: USER_ROLES.CLIENT })
  @ApiOkResponse({ type: CreditCardsEntity, description: 'default' })
  async findOneByAuthor(
    @Req() req: express.Request,
  ): Promise<CreditCardsEntity> {
    return await this.creditCardsService.findOneByAuthor(req);
  }

  @Post()
  @UserRoles(USER_ROLES.CLIENT)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: USER_ROLES.CLIENT })
  @ApiOkResponse({ type: CreditCardsEntity, description: 'default' })
  async create(
    @Req() req: express.Request,
    @Body() CreditCardCreateDto: CreditCardsUpdateDto,
  ): Promise<CreditCardsEntity> {
    return await this.creditCardsService.create(req, CreditCardCreateDto);
  }

  @Put()
  @UserRoles(USER_ROLES.CLIENT)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: USER_ROLES.CLIENT })
  @ApiOkResponse({ type: CreditCardsEntity, description: 'default' })
  async update(
    @Req() req: express.Request,
    @Body() creditCardCreateDto: CreditCardsUpdateDto,
  ): Promise<Partial<CreditCardsEntity>> {
    return await this.creditCardsService.update(req, creditCardCreateDto);
  }

  @Put('status/:id')
  @UserRoles(USER_ROLES.ADMIN)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: USER_ROLES.ADMIN })
  @ApiOkResponse({ type: CreditCardsEntity, description: 'default' })
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Query('status') status: DOCUMENT_STATUS,
  ): Promise<CreditCardsEntity> {
    return await this.creditCardsService.changeStatus(id, status);
  }
}
