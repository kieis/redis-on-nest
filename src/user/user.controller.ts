import {
  Controller,
  Get,
  Inject,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
} from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('users')
export class UserController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getUserByEmail(@Param(':email') email: string): Promise<User> {
    const user = await this.userService.user({
      email,
    });
    return user;
  }

  @Get('all')
  async getAllUsers(): Promise<User[]> {
    const users = await this.userService.users({});
    return users;
  }

  @Get('test')
  async getTest(): Promise<string> {
    const cached = await this.cacheManager.get<string>('auto-caching-user');
    return JSON.stringify(cached);
  }

  @Get('auto-caching')
  @CacheKey('auto-caching-user')
  @CacheTTL(10)
  async getAutoCaching() {
    const users = await this.userService.users({});
    return users;
  }
}
