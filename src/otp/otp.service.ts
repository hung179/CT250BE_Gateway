import { Injectable } from '@nestjs/common';
import { RedisService } from '../redisCache/redis.service'; // Sử dụng RedisService đã cấu hình
import * as crypto from 'crypto'; // Để tạo OTP ngẫu nhiên

@Injectable()
export class OtpService {
  constructor(private readonly redisService: RedisService) {}

  // Tạo OTP ngẫu nhiên (6 ký tự)
  generateOtp(): string {
    return crypto.randomBytes(3).toString('hex'); // Tạo OTP ngẫu nhiên
  }

  // Lưu OTP vào Redis với TTL 60 giây
  async storeOtp(email: string, otp: string): Promise<void> {
    const otpKey = `otp:${email}`; // Định danh OTP dựa vào email
    await this.redisService.set(otpKey, otp, 60); // TTL 60 giây
  }

  // Kiểm tra OTP đã được lưu và còn hiệu lực hay không
  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const otpKey = `otp:${email}`;
    console.log(otpKey);
    const storedOtp = await this.redisService.get(otpKey);
    console.log(storedOtp);
    if (storedOtp && storedOtp === otp) {
      await this.redisService.del(otpKey); // Xóa OTP sau khi sử dụng
      return true;
    }
    return false;
  }
}
