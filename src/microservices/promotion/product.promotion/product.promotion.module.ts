import { Module } from '@nestjs/common';
import { ProductPromotionService } from './product.promotion.service';
import { ProductPromotionController } from './product.promotion.controller';
import { RedisMessageBrokerModule } from 'src/redisMessageBroker/redisMessageBroker.module';
import { AuthModule } from 'src/auth/auth.module';
import { RedisCacheModule } from 'src/redisCache/redisCache.module';

@Module({
  imports: [RedisMessageBrokerModule, AuthModule, RedisCacheModule],
  providers: [ProductPromotionService],
  controllers: [ProductPromotionController],
})
export class ProductPromotionModule {}
