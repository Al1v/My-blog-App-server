import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommenttDto } from './dto/comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  getPostComments(@Query() query: { postId: number }) {
    return this.commentsService.getCommentsByPostId(query.postId);
  }

  @Get('last')
  getLastComments() {
    return this.commentsService.getLastComments();
  }

  @UseGuards(AuthGuard)
  @Post()
  createComment(@Body() data: CreateCommenttDto, @Req() req: Request) {
    return this.commentsService.newComment(data, req);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteComment(@Param() params: { id: number }, @Req() req: Request) {
    return this.commentsService.deleteComment(params.id, req);
  }
}
