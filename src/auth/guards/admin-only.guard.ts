import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class AdminOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    console.log(request.user);
    if (!request.user || request.user.role !== 'admin') {
      throw new ForbiddenException('Access restricted to admin only');
    }
    return true;
  }
}
