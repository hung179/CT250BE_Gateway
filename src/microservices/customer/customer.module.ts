import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { RedisMessageBrokerModule } from 'src/redisMessageBroker/redisMessageBroker.module';
import { RedisMessageBrokerService } from 'src/redisMessageBroker/redisMessageBroker.service';
import { RedisCacheModule } from 'src/redisCache/redisCache.module';

@Module({
  imports: [
      RedisMessageBrokerModule,
      RedisCacheModule
  ],
  providers: [CustomerService],
  controllers: [CustomerController],
  exports: [CustomerService] 
})
export class CustomerModule  {}
