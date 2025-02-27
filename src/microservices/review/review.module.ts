import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { RedisMessageBrokerModule } from 'src/redisMessageBroker/redisMessageBroker.module';
import { AuthModule } from 'src/auth/auth.module';
import { RedisCacheModule } from 'src/redisCache/redisCache.module';

@Module({
  imports: [RedisMessageBrokerModule, AuthModule, RedisCacheModule],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
