import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { RedisCacheModule } from '../redisCache/redisCache.module'; // RedisModule đã cấu hình từ trước

@Module({
  imports: [RedisCacheModule],
  providers: [OtpService],
  controllers: [],
  exports: [OtpService],
})
export class OtpModule {}
