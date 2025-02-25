import { OtpService } from './../otp/otp.service';
import { Injectable } from '@nestjs/common';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly emailService: EmailService,
    private readonly OtpService: OtpService
  ) {}

  // Phương thức đăng ký người dùng
  async verificationEmail(email: string): Promise<void> {
    try {
      const otp = this.OtpService.generateOtp();
      this.OtpService.storeOtp(email, otp);
      const subject = `Mã xác thực Email: ${otp}`;
      const text = `Mã xác thực Email: ${otp}`;
      await this.emailService.sendMail(email, subject, text);
    } catch (error) {
      console.log(error);
    }
  }

  async checkOtp(email: string, otp: string): Promise<any> {
    return this.OtpService.verifyOtp(email, otp);
  }
}
