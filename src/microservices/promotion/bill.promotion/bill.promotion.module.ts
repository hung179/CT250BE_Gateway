import { Module } from '@nestjs/common';
import { BillPromotionService } from './bill.promotion.service';
import { BillPromotionController } from './bill.promotion.controller';
import { RedisMessageBrokerModule } from 'src/redisMessageBroker/redisMessageBroker.module';
import { AuthModule } from 'src/auth/auth.module';
import { RedisCacheModule } from 'src/redisCache/redisCache.module';

@Module({
  imports: [RedisMessageBrokerModule, AuthModule, RedisCacheModule],
  providers: [BillPromotionService],
  controllers: [BillPromotionController],
})
export class BillPromotionModule {}
