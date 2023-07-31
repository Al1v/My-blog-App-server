import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  createUser(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto)
  }

  @Get()
  getUsers() {
    return this.usersService.getAllUsers()
  }

  @Get(':id')
  getUser(@Param() params: any) {
    console.log(params.id)
    return this.usersService.getUserByEmail(params.id)
  }
}
