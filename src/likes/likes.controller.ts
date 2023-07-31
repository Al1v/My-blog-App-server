import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private likesService: LikesService){}

  @Get(':id')
  getPostLikesNumber(@Param() params: any){
    return this.likesService.getLikesNumber(params.id)
  }

  @UseGuards(AuthGuard)
  @Post(':id')
  setLike(@Param() params: any, @Body() body: any, @Req() request: any){
    return this.likesService.setLike(params, request)
  }
}
