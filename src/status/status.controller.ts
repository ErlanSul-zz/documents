import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { StatusService } from './status.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { UserRolesGuard } from '../auth/guards/user-roles.guard';
import { UserRoles } from '../auth/decorators/roles.decorator';
import { USER_ROLES } from '../users/constants/enum.constants';
import { ApiTags } from '@nestjs/swagger';

@Controller('status')
@ApiTags('status')
@UseGuards(AuthenticatedGuard, UserRolesGuard)
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get('/:userId')
  @UserRoles(USER_ROLES.ADMIN)
  async userDocumentVerified(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<boolean> {
    return await this.statusService.userDocumentVerified(userId);
  }
}
