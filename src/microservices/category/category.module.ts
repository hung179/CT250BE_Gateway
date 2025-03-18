import { Module } from '@nestjs/common';
import { RedisMessageBrokerModule } from 'src/redisMessageBroker/redisMessageBroker.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { RedisCacheModule } from 'src/redisCache/redisCache.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [RedisMessageBrokerModule, AuthModule, RedisCacheModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
