import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { Post } from 'src/posts/posts.model';
import { User } from 'src/users/users.model';
import { LikesController } from './likes.controller';
import { Like } from './likes.model';
import { LikesService } from './likes.service';

@Module({
  imports: [AuthModule, SequelizeModule.forFeature([User, Post, Like])],
  controllers: [LikesController],
  providers: [LikesService]
})
export class LikesModule {}
