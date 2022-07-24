import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import express from 'express';
import { UsersEntity } from '../users/users.entity';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { LocalAuthGuard } from './guards/local.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registration(
    @Body() createUserDto: CreateUserDto,
    @Req() req: express.Request,
  ): Promise<Partial<UsersEntity>> {
    return await this.authService.registration(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Req() req: express.Request): any {
    return { User: req.user, msg: 'User logged in' };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/protected')
  getHello(@Req() req: express.Request): Express.User {
    return req.user;
  }

  @Get('/logout')
  logout(@Req() req: express.Request): { msg: string } {
    req.session.destroy((err: any) => {
      console.log(err);
    });
    return { msg: 'The user session has ended' };
  }
}
