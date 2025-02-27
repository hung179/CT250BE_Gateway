import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { RedisMessageBrokerService } from './redisMessageBroker.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'REDIS_CLIENT',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
            db: 1,
          },
        }),
      },
    ]),
  ],
  providers: [RedisMessageBrokerService],
  exports: [RedisMessageBrokerService],
})
export class RedisMessageBrokerModule {}
