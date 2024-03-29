import { Injectable } from '@nestjs/common';
import RedisC, { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheService {
  redisClient: Redis;
  constructor(private configService: ConfigService) {
    this.redisClient = new RedisC({
      port: this.configService.get('REDIS_PORT'), // Redis port
      host: this.configService.get('REDIS_HOST'), // Redis host
      family: 4, // 4 (IPv4) or 6 (IPv6)
      password: '',
      db: 0,
    });
  }

  // 编写几个设置redis的便捷方法

  /**
   * @Description: 封装设置redis缓存的方法
   * @param key {String} key值
   * @param value {String} key的值
   * @param seconds {Number} 过期时间
   * @return: Promise<any>
   */
  public async set(key: string, value: any, seconds?: number): Promise<any> {
    value = JSON.stringify(value);
    if (!seconds) {
      await this.redisClient.set(key, value);
    } else {
      await this.redisClient.set(key, value, 'EX', seconds);
    }
  }

  /**
   * @Description: 设置获取redis缓存中的值
   * @param key {String}
   */
  public async get(key: string): Promise<any> {
    const data = await this.redisClient.get(key);
    if (data) return data;
    return null;
  }

  /**
   * @Description: 根据key删除redis缓存数据
   * @param key {String}
   * @return:
   */
  public async del(key: string): Promise<any> {
    return await this.redisClient.del(key);
  }

  /**
   * @Description: 清空redis的缓存
   * @param {type}
   * @return:
   */
  public async flushall(): Promise<any> {
    return await this.redisClient.flushall();
  }
}
