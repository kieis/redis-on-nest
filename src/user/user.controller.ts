import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';

@Controller('user')
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
}
