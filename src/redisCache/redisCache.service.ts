import { Injectable, Inject } from '@nestjs/common';
import * as Redis from 'ioredis';

@Injectable()
export class RedisCacheService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis.Redis
  ) {}

  async set(key: string, value: string, ttl: number) {
    await this.redisClient.setex(key, ttl, value);
  }

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async del(key: string) {
    await this.redisClient.del(key);
  }

  async sadd(tokenKey: string, refreshToken: string) {
    return await this.redisClient.sadd(tokenKey, refreshToken);
  }

  async sismember(tokenKey: string, refreshToken: string) {
    return await this.redisClient.sismember(tokenKey, refreshToken);
  }

  async srem(tokenKey: string, refreshToken: string) {
    return await this.redisClient.srem(tokenKey, refreshToken);
  }

  async expire(tokenKey: string, arg1: number) {
    return await this.redisClient.expire(tokenKey, arg1);
  }

  async setex(tokenKey: string, arg1: number, userId: any) {
    return await this.redisClient.setex(tokenKey, arg1, userId);
  }
}
