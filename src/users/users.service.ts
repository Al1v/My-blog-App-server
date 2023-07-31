import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/user.dto';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userRepository: typeof User,
  ) {}

  async createUser(dto: CreateUserDto) {
    try {
      const user = await this.userRepository.create(dto);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers() {
    try {
      return await this.userRepository.findAll({ include: { all: true } });
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email: string) {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: number) {
    try {
      return await this.userRepository.findOne({ where: { id } });
    } catch (error) {
      throw error;
    }
  }
}
