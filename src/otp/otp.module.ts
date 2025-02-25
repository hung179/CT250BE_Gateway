import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { RedisModule } from '../redisCache/redis.module'; // RedisModule đã cấu hình từ trước

@Module({
  imports: [RedisModule],
  providers: [OtpService],
  controllers: [],
  exports: [OtpService],
})
export class OtpModule {}
