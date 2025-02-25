import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('sendMail')
  async testSendMain() {
    const email = 'chuongtran05032003@gmail.com';
    return this.authService.verificationEmail(email);
  }

  @Get('checkOtp')
  async testcheckotp(
    @Query('email') email: string,
    @Query('otp') otp: string
  ): Promise<any> {
    return this.authService.checkOtp(email, otp);
  }
}
