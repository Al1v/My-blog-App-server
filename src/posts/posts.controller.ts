import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { multerOptions } from 'src/config/multer.config';
import * as fs from 'fs';
import * as path from 'path';
import { AuthGuard } from 'src/auth/auth.guard';
import { getUserGuard } from 'src/auth/getUser.guard';
import { Request } from 'express';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return JSON.stringify(file.filename);
  }
  @Delete('upload/:id')
  deleteImage(@Param() params: any) {
    try {
      const filePath = path.resolve('uploads', params.id);
      fs.unlink(filePath, () => {});
      return { success: true };
    } catch (e) {
      return e;
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  createPost(@Body() dto: CreatePostDto, @Req() req: Request) {
    console.log(dto)
    console.log(req)
    return this.postsService.createPost(req, dto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  editPost(@Body() dto: CreatePostDto, @Param() params, @Req() req) {
    const { id } = params;
    return this.postsService.editPost(id, dto, req);
  }
  @UseGuards(getUserGuard)
  @Get()
  getPostList(@Query() query: any, @Req() req: any ) {
    const sort = query?.tab;
    const tag = query?.tag;

    return this.postsService.getPostsList(tag, sort, req);
  }
  @UseGuards(getUserGuard)
  @Get(':id')
  getPost(@Param() params: any, @Req() req: any ) {
    return this.postsService.getPostById(params.id, req);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deletePost(@Param() params: any, @Req() req) {
    return this.postsService.deletePost(params.id, req);
  }
}
