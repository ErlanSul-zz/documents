import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRoles } from '../auth/decorators/roles.decorator';
import { USER_ROLES } from './constants/enum.constants';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import express from 'express';
import { UsersEntity } from './users.entity';
import { getUserSession } from '../global.helpers';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { UserRolesGuard } from '../auth/guards/user-roles.guard';

@Controller('users')
@ApiTags('users')
@UseGuards(AuthenticatedGuard, UserRolesGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @UserRoles(USER_ROLES.CLIENT)
  @ApiOperation({ summary: USER_ROLES.CLIENT })
  @ApiOkResponse({ type: UsersEntity, description: 'default' })
  async getUserDocuments(@Req() req: express.Request): Promise<UsersEntity> {
    const sessionUserData = getUserSession(req);
    return await this.userService.getUserDocuments(sessionUserData.id);
  }

  @Get('admin/:userId')
  @UserRoles(USER_ROLES.ADMIN)
  @ApiOperation({ summary: USER_ROLES.CLIENT })
  @ApiOkResponse({ type: UsersEntity, description: 'default' })
  async getUserDocumentsForAdmin(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<UsersEntity> {
    return await this.userService.getUserDocuments(userId);
  }
}
