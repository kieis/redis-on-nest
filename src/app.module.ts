//import type { RedisClientOptions } from 'redis';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import {
  CacheInterceptor,
  CacheModule,
  CacheStore,
  CacheStoreFactory,
} from '@nestjs/cache-manager';

import * as redisStore from 'cache-manager-redis-store';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    //CacheModule.register<RedisClientOptions>({ ~~ can't use type while lib isn't updated
    //https://github.com/dabroek/node-cache-manager-redis-store/issues/53
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      username: process.env.REDIS_USER || undefined,
      password: process.env.REDIS_PASSWORD || undefined,
      database: 0,
      isGlobal: true,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    AppService,
  ],
})
export class AppModule {}
