import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class CustomerLocalStrategy extends PassportStrategy(
  Strategy,
  'customer-local'
) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email_KH', passwordField: 'password_KH' });
  }

  async validate(email_KH: string, password_KH: string): Promise<any> {
    const user = await this.authService.validateCustomer(email_KH, password_KH);
    if (!user) throw new UnauthorizedException('Invalid customer credentials');
    return user;
  }
}