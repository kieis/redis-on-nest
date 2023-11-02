import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @Get('auto-caching')
  @CacheKey('auto-caching-user')
  @CacheTTL(10)
  async getAutoCaching() {
    const users = await this.userService.users({});
    return users;
  }
}
