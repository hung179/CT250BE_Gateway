import { RedisCacheModule } from 'src/redisCache/redisCache.module';
import { RedisMessageBrokerModule } from 'src/redisMessageBroker/redisMessageBroker.module';
import { AttributeController } from './attribute.controller';
import { AttributeService } from './attribute.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [RedisMessageBrokerModule, RedisCacheModule],
  providers: [AttributeService],
  controllers: [AttributeController],
})
export class AttributeModule {}
