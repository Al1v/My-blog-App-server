import { Body, Controller, Post, Res } from '@nestjs/common';
import { CreateUserDto, LoginDto } from 'src/users/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  login(@Body() userDto: LoginDto) {
    //console.log(res.body)

    return this.authService.login(userDto);
  }

  @Post('/register')
  registration(@Body() userDto: CreateUserDto) {
    console.log('register', userDto);
    return this.authService.register(userDto);
  }
}
