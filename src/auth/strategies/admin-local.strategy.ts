import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AdminLocalStrategy extends PassportStrategy(
  Strategy,
  'admin-local'
) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'username_NS', passwordField: 'mk_NS' });
  }

  async validate(username_NS: string, mk_NS: string): Promise<any> {
    const user = await this.authService.validateAdmin(username_NS, mk_NS);
    if (!user) throw new UnauthorizedException('Invalid admin credentials');
    return user; 
  }
}