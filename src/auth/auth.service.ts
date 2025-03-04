/* eslint-disable @typescript-eslint/require-await */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisCacheService } from '../redisCache/redisCache.service'; // Redis để lưu refresh token
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private redisCacheService: RedisCacheService,
    private configService: ConfigService
  ) {}

  // Đăng nhập và tạo accessToken + refreshToken
  async login(user: any, userType: 'admin' | 'customer') {
    const payload = { userId: user.userId };
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
      user.userId,
      7 * 24 * 60 * 60
    );

    return { accessToken, refreshToken };
  }

  // Xác thực Admin
  async validateAdmin(email: string, password: string): Promise<any> {
    // Tạm thời để kiểm thử
    const admin = {
      userId: '123',
      email: 'abc',
      password: '123',
      role: 'admin',
    }; // Gọi CustomerService lấy thông tin đăng nhập
    //if (!admin) throw new UnauthorizedException('Email không tồn tại');

    // Mã hóa và so sánh mật khẩu
    //const isMatch = await bcrypt.compare(password, user.password);
    //if (!isMatch) throw new UnauthorizedException('Sai mật khẩu');

    // Tạm thời để kiểm thử
    const isMatch = password.match(admin.password) ? true : false;
    if (!isMatch) throw new UnauthorizedException('Sai mật khẩu');

    return admin; // Trả về user nếu xác thực thành công
  }

  // Xác thực Customer
  async validateCustomer(email: string, password: string): Promise<any> {
    // Tạm thời để kiểm thử
    const customer = { userId: '321', email: 'abc', password: '123' }; // Gọi AdminService lấy thông tin đăng nhập
    //if (!customer) throw new UnauthorizedException('Email không tồn tại');

    // Mã hóa và so sánh mật khẩu
    //const isMatch = await bcrypt.compare(password, user.password);
    //if (!isMatch) throw new UnauthorizedException('Sai mật khẩu');

    // Tạm thời để kiểm thử
    const isMatch = password.match(customer.password) ? true : false;
    if (!isMatch) throw new UnauthorizedException('Sai mật khẩu');

    return customer; // Trả về user nếu xác thực thành công
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
