import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisCacheService } from '../redisCache/redisCache.service'; // Redis để lưu refresh token
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { AdminService } from 'src/microservices/admin/admin.service';
import { CustomerService } from 'src/microservices/customer/customer.service';
import { OtpService } from 'src/otp/otp.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private redisCacheService: RedisCacheService,
    private configService: ConfigService,
    private adminService: AdminService,
    private customerService: CustomerService,
    private otpService: OtpService,
    private emailService: EmailService
  ) {}

  // Đăng nhập và tạo accessToken + refreshToken
  async login(user: any, userType: 'admin' | 'customer') {
    const payload = { userId: user._id };
    if (userType === 'admin') {
      payload['role'] = user.role;
    }
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    await this.redisCacheService.set(
      `refresh_token:${refreshToken}`,
      user._id,
      7 * 24 * 60 * 60
    );

    return { accessToken, refreshToken, userId: user._id };
  }

  // Xác thực Admin
  async validateAdmin(username: string, password: string): Promise<any> {
    const admin: any = (
      await this.adminService.findBookStoreByUserName(username)
    ).data;
    if (!admin) throw new UnauthorizedException('Username không tồn tại');

    // Mã hóa và so sánh mật khẩu
    const isMatch = await bcrypt.compare(password, admin.mk_NS);
    if (!isMatch) throw new UnauthorizedException('Sai mật khẩu');

    return admin; // Trả về user nếu xác thực thành công
  }

  // Xác thực Customer
  async validateCustomer(email: string, password: string): Promise<any> {
    const customer: any = (await this.customerService.findUserByEmail(email))
      .data;
    if (!customer) throw new UnauthorizedException('Email không tồn tại');

    // Mã hóa và so sánh mật khẩu
    const isMatch = await bcrypt.compare(password, customer.password_KH);
    if (!isMatch) throw new UnauthorizedException('Sai mật khẩu');

    return customer; // Trả về user nếu xác thực thành công
  }

  async loginWithEmailOtp(email: string, otp: string) {
    return this.verifyOtpAndGetToken(email, otp, 'login');
  }

  // Gửi OTP cho đăng nhập bằng email
  async sendLoginOtp(email: string) {
    // Kiểm tra email có tồn tại không
    const customer = await this.customerService.findUserByEmail(email);
    if (!customer.success) {
      throw new UnauthorizedException('Email không tồn tại trong hệ thống');
    }

    // Tạo OTP
    const otp = this.otpService.generateOtp();

    // Lưu OTP vào Redis với key login:{email}
    await this.otpService.storeOtp(`login:${email}`, otp);

    // Gửi OTP qua email
    const subject = 'Mã đăng nhập của bạn';
    const text = `Mã đăng nhập của bạn là: ${otp}. Mã này sẽ hết hạn sau 60 giây.`;
    const html = `
      <h2>Đăng nhập vào hệ thống</h2>
      <p>Mã đăng nhập của bạn là: <strong>${otp}</strong></p>
      <p>Mã này sẽ hết hạn sau 60 giây.</p>
    `;

    await this.emailService.sendMail(email, subject, text, html);

    return {
      success: true,
      message: 'Mã OTP đã được gửi đến email của bạn',
    };
  }

  // Xử lý refresh token để cấp lại access token
  async refreshAccessToken(refreshToken: string) {
    try {
      // 🔍 Giải mã refreshToken để lấy userId
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const userId = payload.userId;
      // 🛠 Kiểm tra refreshToken trong Redis
      const tokenKey = `refresh_token:${refreshToken}`;
      const userIdInCache = await this.redisCacheService.get(tokenKey);
      const isValid = userIdInCache === userId;
      console.log(payload, isValid, userIdInCache);
      if (!isValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // // 🔑 Tạo accessToken mới
      const accessToken = this.jwtService.sign(
        { userId: payload.userId, role: payload.role },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: '15m',
        }
      );

      return {
        accessToken,
        userId,
      };
    } catch (error) {
      console.log(error);
      return { error };
    }
  }

  // Gửi OTP cho đặt lại mật khẩu
  async sendPasswordResetOtp(email: string) {
    // Kiểm tra email có tồn tại không
    const customer = await this.customerService.findUserByEmail(email);
    if (!customer.success) {
      throw new UnauthorizedException('Email không tồn tại trong hệ thống');
    }

    // Tạo OTP
    const otp = this.otpService.generateOtp();

    // Lưu OTP vào Redis với key reset:{email}
    await this.otpService.storeOtp(`reset:${email}`, otp);

    // Gửi OTP qua email
    const subject = 'Mã xác nhận đặt lại mật khẩu';
    const text = `Mã xác nhận đặt lại mật khẩu của bạn là: ${otp}. Mã này sẽ hết hạn sau 60 giây.`;
    const html = `
    <h2>Đặt lại mật khẩu</h2>
    <p>Mã xác nhận của bạn là: <strong>${otp}</strong></p>
    <p>Mã này sẽ hết hạn sau 60 giây.</p>
  `;

    await this.emailService.sendMail(email, subject, text, html);

    return {
      success: true,
      message: 'Mã OTP đã được gửi đến email của bạn',
    };
  }

  // Hàm xác thực OTP chung
  // Hàm xác thực OTP chung
async verifyOtpAndGetToken(email: string, otp: string, otpType: 'login' | 'reset'): Promise<any> {
  // Tạo key OTP dựa vào loại
  const otpKey = `${otpType}:${email}`;
  
  // Xác thực OTP
  const isValidOtp = await this.otpService.verifyOtp(otpKey, otp);
  if (!isValidOtp) {
    throw new UnauthorizedException('Mã OTP không hợp lệ hoặc đã hết hạn');
  }
  
  // Tìm thông tin người dùng
  const customer:any = await this.customerService.findUserByEmail(email);
  if (!customer.success) {
    throw new UnauthorizedException('Email không tồn tại trong hệ thống');
  }
  
  // Tạo và trả về token, bất kể là login hay reset
  const payload = { userId: customer.data._id };
  const accessToken = this.jwtService.sign(payload, {
    secret: this.configService.get<string>('JWT_SECRET'),
    expiresIn: '15m',
  });
  
  return {
    success: true,
    message: 'Xác thực OTP thành công',
    userId: customer.data._id,
    accessToken: accessToken
  };
}

  // Đặt lại mật khẩu với accessToken đã xác thực
  async resetPassword(email: string, accessToken: string, newPassword: string) {
    try {
      // Xác thực accessToken
      const payload = this.jwtService.verify(accessToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      // Kiểm tra xem accessToken có thuộc về email này không
      const customer: any = (await this.customerService.findUserByEmail(email))
        .data;
      console.log(customer);
      // Cập nhật mật khẩu trong database thông qua customerService
      const updateResult = await this.customerService.updateUser( 
        { password_KH: newPassword },
        customer._id
      );

      return {
        success: true,
        message: 'Đặt lại mật khẩu thành công',
      };
    } catch (error) {
      if (
        error.name === 'JsonWebTokenError' ||
        error.name === 'TokenExpiredError'
      ) {
        throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
      }
      throw error;
    }
  }
  async logout(refreshToken: string) {
    try {
      const tokenKey = `refresh_token:${refreshToken}`;
      await this.redisCacheService.del(tokenKey);
      return;
    } catch (error) {
      return { error };
    }
  }
}
