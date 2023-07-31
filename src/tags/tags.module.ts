import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tag } from './tags.model';

@Module({
  imports: [SequelizeModule.forFeature([Tag])],
  providers: [TagsService],
  controllers: [TagsController]
})
export class TagsModule {}
