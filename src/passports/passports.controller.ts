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

import express from 'express';
import { PassportsUpdateDto } from './dto/passports-update.dto';
import { PassportsService } from './passports.service';
import { PassportsEntity } from './passports.entity';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { UserRoles } from '../auth/decorators/roles.decorator';
import { USER_ROLES } from '../users/constants/enum.constants';
import { DOCUMENT_STATUS } from '../status/constants/enum.constants';
import { UserRolesGuard } from '../auth/guards/user-roles.guard';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('passports')
@ApiTags('passports')
@UseGuards(AuthenticatedGuard, UserRolesGuard)
export class PassportsController {
  constructor(private readonly passportsService: PassportsService) {}

  @Get()
  @UserRoles(USER_ROLES.CLIENT)
  @ApiOperation({ summary: USER_ROLES.CLIENT })
  @ApiOkResponse({ type: PassportsEntity, description: 'default' })
  async findOneByAuthor(@Req() req: express.Request): Promise<PassportsEntity> {
    return await this.passportsService.findOneByAuthor(req);
  }

  @Post()
  @UserRoles(USER_ROLES.CLIENT)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: USER_ROLES.CLIENT })
  @ApiOkResponse({ type: PassportsEntity, description: 'default' })
  async create(
    @Req() req: express.Request,
    @Body() passportsUpdateDto: PassportsUpdateDto,
  ): Promise<PassportsEntity> {
    return await this.passportsService.create(req, passportsUpdateDto);
  }

  @Put()
  @UserRoles(USER_ROLES.CLIENT)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: USER_ROLES.CLIENT })
  @ApiOkResponse({ type: PassportsEntity, description: 'default' })
  async update(
    @Req() req: express.Request,
    @Body() passportsUpdateDto: PassportsUpdateDto,
  ): Promise<Partial<PassportsEntity>> {
    console.log(passportsUpdateDto);
    return await this.passportsService.update(req, passportsUpdateDto);
  }

  @Put('status/:id')
  @UserRoles(USER_ROLES.ADMIN)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: USER_ROLES.ADMIN })
  @ApiOkResponse({ type: PassportsEntity, description: 'default' })
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Query('status') status: DOCUMENT_STATUS,
  ): Promise<PassportsEntity> {
    return await this.passportsService.changeStatus(id, status);
  }
}
