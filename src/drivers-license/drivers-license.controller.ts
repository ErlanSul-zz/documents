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
import { DriversLicenseService } from './drivers-license.service';
import { DriversLicenseUpdateDto } from './dto/drivers-license-update.dto';
import { DriversLicenseEntity } from './drivers-license.entity';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { UserRoles } from '../auth/decorators/roles.decorator';
import { USER_ROLES } from '../users/constants/enum.constants';
import { DOCUMENT_STATUS } from '../status/constants/enum.constants';
import { UserRolesGuard } from '../auth/guards/user-roles.guard';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('drivers-license')
@ApiTags('drivers-license')
@UseGuards(AuthenticatedGuard, UserRolesGuard)
export class DriversLicenseController {
  constructor(private readonly driversLicenseService: DriversLicenseService) {}

  @Get()
  @UserRoles(USER_ROLES.CLIENT)
  @ApiOperation({ summary: USER_ROLES.CLIENT })
  @ApiOkResponse({ type: DriversLicenseEntity, description: 'default' })
  async findOneByAuthor(
    @Req() req: express.Request,
  ): Promise<DriversLicenseEntity> {
    return await this.driversLicenseService.findOneByAuthor(req);
  }

  @Post()
  @UserRoles(USER_ROLES.CLIENT)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: USER_ROLES.CLIENT })
  @ApiOkResponse({ type: DriversLicenseEntity, description: 'default' })
  async create(
    @Req() req: express.Request,
    @Body() driversLicenseUpdateDto: DriversLicenseUpdateDto,
  ): Promise<DriversLicenseEntity> {
    console.log(driversLicenseUpdateDto);
    return await this.driversLicenseService.create(
      req,
      driversLicenseUpdateDto,
    );
  }

  @Put()
  @UserRoles(USER_ROLES.CLIENT)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: USER_ROLES.CLIENT })
  @ApiOkResponse({ type: DriversLicenseEntity, description: 'default' })
  async update(
    @Req() req: express.Request,
    @Body() driversLicenseUpdateDto: DriversLicenseUpdateDto,
  ): Promise<Partial<DriversLicenseEntity>> {
    return await this.driversLicenseService.update(
      req,
      driversLicenseUpdateDto,
    );
  }

  @Put('status/:id')
  @UserRoles(USER_ROLES.ADMIN)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: USER_ROLES.ADMIN })
  @ApiOkResponse({ type: DriversLicenseEntity, description: 'default' })
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Query('status') status: DOCUMENT_STATUS,
  ): Promise<DriversLicenseEntity> {
    return await this.driversLicenseService.changeStatus(id, status);
  }
}
