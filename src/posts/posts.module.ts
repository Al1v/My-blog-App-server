import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersService } from 'src/users/users.service';
import { Post } from './posts.model';
import { User } from 'src/users/users.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tag } from 'src/tags/tags.model';
import { Comment } from 'src/comments/comments.model';
import { Like } from 'src/likes/likes.model';

@Module({
  imports: [
    AuthModule,
    SequelizeModule.forFeature([User, Post, Tag, Comment, Like]),
  ],
  providers: [PostsService, UsersService],
  controllers: [PostsController],
})
export class PostsModule {}
