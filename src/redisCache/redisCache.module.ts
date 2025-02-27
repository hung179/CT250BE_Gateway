import { Module } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisCacheService } from './redisCache.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        const redis = new Redis({
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          db: 0,
        });
        return redis;
      },
      inject: [ConfigService],
    },
    RedisCacheService,
  ],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
