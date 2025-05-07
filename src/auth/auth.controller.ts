import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CustomerLocalAuthGuard } from './guards/customer_local-auth.guard';
import { AdminLocalAuthGuard } from './guards/admin_local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
@Controller('auth')
export class AuthController {
constructor(private readonly authService: AuthService) {}

@Post('customer-login')
@UseGuards(CustomerLocalAuthGuard)
async customerLogin(@Req() req, @Res() res: Response) {
  try {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user,
      'customer'
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });
    return res.json({ accessToken: accessToken, userId: req.user._id });
  } catch (error) {
    return res.json(error);
  }
}

@Post('admin-login')
@UseGuards(AdminLocalAuthGuard)
async adminLogin(@Req() req, @Res() res: Response) {
  try {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user,
      'admin'
    ); 
    res.cookie('refreshToken', refreshToken, { 
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });
    return res.json({
        accessToken: accessToken,
        userId: req.user._id

    });
  } catch (error) {
    return res.json(error);
  }
}

@Get('refresh-accesstoken')
async refreshAccessToken(@Req() req, @Res() res: Response): Promise<any> {
  console.log('Cookies:', req.cookies); // ✅ Kiểm tra cookie có refreshToken không
  console.log('Authorization Header:', req.headers.authorization);
  const refreshToken = req.cookies?.refreshToken;
  return res.json(await this.authService.refreshAccessToken(refreshToken));
}

@Get('logout')
async logout(@Req() req, @Res() res: Response) {
  const refreshToken = req.cookies?.refreshToken;
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
  return res.json(await this.authService.logout(refreshToken));
}
@Post('email/send-otp')
async sendLoginOtp(@Body() body: { email: string }) {
  try {
    return await this.authService.sendLoginOtp(body.email);
  } catch (error) {
    throw new HttpException(
      error.message || 'Có lỗi xảy ra khi gửi OTP',
      error.status || HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

// Endpoint để đăng nhập bằng email và OTP
@Post('email/login')
async loginWithEmailOtp(@Body() body: { email: string; otp: string }) {
  try {
    
    return await this.authService.loginWithEmailOtp(body.email, body.otp);
  } catch (error) {
    throw new HttpException(
      error.message || 'Đăng nhập không thành công',
      error.status || HttpStatus.UNAUTHORIZED
    );
  }
}

@Post('password/send-otp')
async sendResetPasswordOtp(@Body() body: { email: string }) {
  try {
    return await this.authService.sendPasswordResetOtp(body.email);
  } catch (error) {
    throw new HttpException(
      error.message || 'Có lỗi xảy ra khi gửi OTP',
      error.status || HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

@Post('verify-otp')
async verifyOtp(@Body() body: { email: string; otp: string }) {
  try {
    console.log("Email:", body.email);
    console.log("OTP:", body.otp);
    // verifyOtpAndGetToken sẽ trả về {success, message, userId, accessToken}
    const result = await this.authService.verifyOtpAndGetToken(body.email, body.otp, 'reset');
    
    // Trả về toàn bộ kết quả bao gồm accessToken và userId
    return result;
  } catch (error) {
    throw new HttpException(
      error.message || 'Có lỗi xảy ra khi xác thực OTP',
      error.status || HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

// Đặt lại mật khẩu bằng OTP
@Post('password/reset')
async resetPassword(@Body() body: { email: string; accessToken: string; newPassword: string }) {
  try {
    return await this.authService.resetPassword(
      body.email,
      body.accessToken,
      body.newPassword
    );
  } catch (error) {
    throw new HttpException(
      error.message || 'Đặt lại mật khẩu không thành công',
      error.status || HttpStatus.UNAUTHORIZED
    );
  }
}
}