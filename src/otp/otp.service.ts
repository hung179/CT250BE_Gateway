import { Injectable } from '@nestjs/common';
import { RedisCacheService } from '../redisCache/redisCache.service'; // Sử dụng redisCacheService đã cấu hình
import * as crypto from 'crypto'; // Để tạo OTP ngẫu nhiên

@Injectable()
export class OtpService {
  constructor(private readonly redisCacheService: RedisCacheService) {}

  // Tạo OTP ngẫu nhiên (6 ký tự)
  generateOtp(): string {
    return crypto.randomBytes(3).toString('hex'); // Tạo OTP ngẫu nhiên
  }

  // Lưu OTP vào Redis với TTL 60 giây
  async storeOtp(key: string, otp: string, expiresIn: number = 60): Promise<void> {
    const otpKey = `otp:${key}`; 
    await this.redisCacheService.set(otpKey, otp, expiresIn);
  }

  // Kiểm tra OTP đã được lưu và còn hiệu lực hay không
  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const otpKey = `otp:${email}`;
    console.log(otpKey);
    const storedOtp = await this.redisCacheService.get(otpKey);
    console.log(storedOtp);
    if (storedOtp && storedOtp === otp) {
      await this.redisCacheService.del(otpKey); // Xóa OTP sau khi sử dụng
      return true;
    }
    return false;
  }
}
