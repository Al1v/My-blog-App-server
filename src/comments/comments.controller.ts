import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService){}

  @Get()
  getPostComments(@Query() query: any) { 
    return this.commentsService.getCommentsByPostId(query.postId)
  }

  @Get('last')
  getLastComments() { 
    return this.commentsService.getLastComments()
  }

  @UseGuards(AuthGuard)
  @Post()
  createComment(@Body() data) {
    return this.commentsService.newComment(data)
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  deletePost(@Param() params: any){
    return this.commentsService.deleteComment(params.id)
  }
}
