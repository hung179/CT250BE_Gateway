import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailModule } from 'src/email/email.module';
import { OtpModule } from 'src/otp/otp.module';

@Module({
  imports: [EmailModule, OtpModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
