import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { RedisCacheService } from 'src/redisCache/redisCache.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private redisService: RedisCacheService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token');
    }

    const token = authHeader.split(' ')[1];
    // 🔍 Kiểm tra accessToken có bị blacklist không
    const isBlacklisted = await this.redisService.get(
      `blacklist_token:${token}`
    );
    if (isBlacklisted) {
      throw new UnauthorizedException('Token has been revoked');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload; 
      // Gán user vào request để sử dụng trong controller
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}