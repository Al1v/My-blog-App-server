import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { request } from 'http';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization  || ''
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];
      console.log(token)
      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'User is not authorized',
        });
      }
    
      const user = this.jwtService.verify(token);
      user.password = null
      req.user = user;

      return true;
    } catch (e) {
      console.log(e);
      throw new HttpException(
        'access forbidden' + e.message,
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
