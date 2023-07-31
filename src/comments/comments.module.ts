import { Module } from '@nestjs/common';
import { Post } from 'src/posts/posts.model';
import { User } from 'src/users/users.model';
import { CommentsController } from './comments.controller';
import { Comment } from './comments.model';
import { CommentsService } from './comments.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [SequelizeModule.forFeature([User, Post, Comment]), AuthModule],
})
export class CommentsModule {}
