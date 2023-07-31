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
  createPost(@Body() data, @Req() req) {
    return this.postsService.createPost(req, data);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  editPost(@Body() data, @Param() params: any) {
    const { id } = params;
    console.log('patch');
    return this.postsService.editPost(id, data);
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
  deletePost(@Param() params: any) {
    return this.postsService.deletePost(params.id);
  }
}
