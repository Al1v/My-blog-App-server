import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TagsModule } from './tags/tags.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/users.model';
import { Comment } from './comments/comments.model';
import { Post } from './posts/posts.model';
import { ConfigModule } from '@nestjs/config';
import { Tag } from './tags/tags.model';
import { Like } from './likes/likes.model';


@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRESS_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Comment, Post, Tag, Like],
      autoLoadModels: true,
      synchronize: true
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    UsersModule,
    PostsModule,
    AuthModule,
    CommentsModule,
    LikesModule,
    TagsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}