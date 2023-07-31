import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Get(':id')
  getTagsByPostId(@Param() params: any) {
    return this.tagsService.getTagsByPostId(params.id);
  }

  @Get()
  getLastTags() {
    return this.tagsService.getLastTags();
  }

  @Post()
  addTags(@Body() data) {
    return this.tagsService.addTags(data);
  }
}
