import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize, where } from 'sequelize';
import { CreateTagsDto } from './dto/create-tag.dto';
import { Tag } from './tags.model';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag)
    private tagsRepository: typeof Tag,
  ) {}

  async getLastTags() {
    try {
      const tags = await this.tagsRepository.findAll({
        attributes: ['tag', [Sequelize.fn('COUNT', 'tag'), 'tagCount']],
        group: ['tag'],
        order: [['tagCount', 'DESC']],
        limit: 7,
      });
      return tags.map((tag) => tag.tag);
    } catch (error) {
      throw error;
    }
  }

  async getTagsByPostId(postId: number) {
    try {
      return await this.tagsRepository.findAll({ where: { postId } });
    } catch (error) {
      throw error;
    }
  }

  async addTags(data: CreateTagsDto) {
    try {
      const { postId, tags } = data;
      const convertedTags = tags.map((tag) => {
        return {
          tag,
          postId,
        };
      });
      return await this.tagsRepository.bulkCreate(convertedTags);
    } catch (error) {
      throw error;
    }
  }
}
