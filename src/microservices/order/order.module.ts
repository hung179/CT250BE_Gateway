import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { RedisMessageBrokerModule } from 'src/redisMessageBroker/redisMessageBroker.module';
import { AuthModule } from 'src/auth/auth.module';
import { RedisCacheModule } from 'src/redisCache/redisCache.module';

@Module({
  imports: [RedisMessageBrokerModule, AuthModule, RedisCacheModule],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
