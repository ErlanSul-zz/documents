import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import express from 'express';

@Injectable()
export class UserRolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [context.getHandler(), context.getClass()]);
    if (roles === undefined) {
      return true;
    }

    const request = context.switchToHttp().getRequest<express.Request>();
    const user: Partial<Express.User> = request.user;
    const hasRole = () => user.roles.some((role) => !!roles.find((item) => item === role));

    return user.roles !== undefined && hasRole();
  }
}
