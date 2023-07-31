import {
  HttpException,
  HttpStatus,
  BadRequestException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto, LoginDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(userDto: LoginDto) {
    console.log('login', userDto);
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async register(userDto: CreateUserDto) {
    const candidate = await this.usersService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException(
        'user with such email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.usersService.createUser({
      ...userDto,
      password: hashPassword,
    });
    console.log(hashPassword);
    console.log(user);
    console.log(this.generateToken(user));
    return this.generateToken(user);
  }

  private async generateToken(user) {
    console.log({user})
    const payload = {
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      id: user.id,
      roles: user.roles,
    };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: LoginDto) {
    try {
      console.log({ userDto });

      const user = await this.usersService.getUserByEmail(userDto.email);
      if (!user) {
        throw new NotFoundException('user with such email was not found');
      }
      console.log({ user });
      console.log(userDto.password);
      console.log(user.password);
      const passwordEquals = await bcrypt.compare(
        userDto.password,
        user.password,
      );
      if (user && passwordEquals) {
        return user;
      }
      throw new UnauthorizedException('invalid password');
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
