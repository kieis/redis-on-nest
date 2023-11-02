//import type { RedisClientOptions } from 'redis';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';

import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    //CacheModule.register<RedisClientOptions>({ ~~ can't use type while lib isn't updated
    //https://github.com/dabroek/node-cache-manager-redis-store/issues/53
    CacheModule.register({
      store: redisStore as unknown as CacheStore,
      host: 'localhost',
      port: 6379,
      isGlobal: true,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
