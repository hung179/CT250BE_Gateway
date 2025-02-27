import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { RedisMessageBrokerModule } from 'src/redisMessageBroker/redisMessageBroker.module';
import { AuthModule } from 'src/auth/auth.module';
import { RedisCacheModule } from 'src/redisCache/redisCache.module';

@Module({
  imports: [RedisMessageBrokerModule, AuthModule, RedisCacheModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
