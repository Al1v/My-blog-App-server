import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './posts.model';
import { Tag } from 'src/tags/tags.model';
import { Comment } from 'src/comments/comments.model';
import { Sequelize } from 'sequelize';
import * as fs from 'fs';
import * as path from 'path';
import { Like } from 'src/likes/likes.model';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Tag)
    private tagsRepository: typeof Tag,
    @InjectModel(Post)
    private postsRepository: typeof Post,
  ) {}

  async getPostById(id, req) {
    try {
      const { user } = req;
      const userId = user?.id || null;

      const post = await this.postsRepository.findByPk(id, {
        include: [
          { model: User, attributes: { exclude: ['password'] } },
          {
            model: Tag,
            attributes: ['tag'],
          },
          {
            model: Comment,
            include: [{ model: User, attributes: { exclude: ['password'] } }],
          },
        ],
        attributes: {
          exclude: ['updatedAt'],
          include: [
            [
              Sequelize.literal(
                `(select (count(*)::int) from comments where comments."postId" = ${+id})`,
              ),
              'commentsCount',
            ],
            [
              Sequelize.literal(
                `(select (count(*)::int) from likes where likes."postId" = ${+id})`,
              ),
              'likesCount',
            ],
            [
              Sequelize.literal(
                `(select (count(*)::int::bool) from likes where likes."postId" = ${+id} AND likes."userId" = ${+userId})`,
              ),
              'isLiked',
            ],
          ],
        },
        order: [[{ model: Comment, as: 'comments' }, 'id', 'DESC']],
      });
      if (post) {
        await post.increment('viewsCount', { by: 1 });

        const cleanPost = post.toJSON();

        return convertTags([cleanPost])[0];
      }

      return {};
    } catch (error) {
      throw error;
    }
  }

  async getPostsList(tag, sort, req) {
    try {
      const { user } = req;
      const userId = user?.id || null;
      const sortBy = sort == 'popular' ? 'viewsCount' : 'id';
      const order = 'DESC';

      if (tag) {
        const posts = await this.tagsRepository.findAll({
          where: { tag },
          attributes: [],
          include: {
            model: Post,
            include: [
              { model: Tag, as: 'tags', attributes: ['tag'] },
              { model: User, attributes: { exclude: ['password'] } },
            ],
            attributes: {
              exclude: ['updatedAt'],
              include: [
                [
                  Sequelize.literal(
                    '(select (count(*)::int) from comments where "comments"."postId" = post.id)',
                  ),
                  'commentsCount',
                ],
                [
                  Sequelize.literal(
                    `(select (count(*)::int) from likes where likes."postId" = post.id)`,
                  ),
                  'likesCount',
                ],
                [
                  Sequelize.literal(
                    `(select (count(*)::int::bool) from likes where likes."postId" = post.id AND likes."userId" = ${+userId})`,
                  ),
                  'isLiked',
                ],
              ],
            },
            order: [[sortBy, order]],
          },
        });
        const cleanPosts = JSON.parse(
          JSON.stringify(posts.map((post) => post.post)),
        );

        return convertTags(cleanPosts);
      }

      const posts = await this.postsRepository.findAll({
        include: [
          { model: User, attributes: { exclude: ['password'] } },
          {
            model: Tag,
            attributes: ['tag'],
          },
          {
            model: Comment,
            attributes: [],
          },
          {
            model: Like,
            attributes: [],
          },
        ],
        attributes: {
          exclude: ['updatedAt'],
          include: [
            [
              Sequelize.literal('(COUNT("comments"."id")::int)'),
              'commentsCount',
            ],
            [
              Sequelize.literal(
                `(SELECT COUNT(*)::int from likes where likes."postId" = "Post".id)`,
              ),
              'likesCount',
            ],
            [
              Sequelize.literal(
                `(SELECT (COUNT(*)::int::bool) from likes where likes."postId" = "Post".id AND likes."userId" = ${+userId})`,
              ),
              'isLiked',
            ],
          ],
        },
        group: ['Post.id', 'user.id', 'tags.id', 'likes.id'],
        order: [[sortBy, order]],
      });
      const cleanPosts = JSON.parse(JSON.stringify(posts));
      return convertTags(cleanPosts);
    } catch (error) {
      throw error;
    }
  }

  async deletePost(id, req) {
    try {
      const post = await this.postsRepository.findByPk(id, { raw: true });
      if (!post) {
        return;
      }
      if (post.userId !== req.user.id) {
        return new UnauthorizedException();
      }
      if (post.imageUrl) {
        deleteImage(post.imageUrl);
      }
      const result = await this.postsRepository.destroy({
        where: { id },
      });

      if (result) {
        return { success: true };
      }
      return;
    } catch (error) {
      throw error;
    }
  }

  async createPost(req, dto: CreatePostDto) {
    try {
      const tags = dto.tags || [];
      const convertedTags = tags.map((tag: string) => {
        return { tag };
      });

      const additionalData = {
        viewsCount: 0,
        commentsCount: 0,
        userId: req.user.id,
      };

      const post = await this.postsRepository.create(
        {
          ...dto,
          ...additionalData,
          tags: convertedTags,
        },
        { include: [Tag] },
      );
      return post;
    } catch (error) {
      throw error;
    }
  }

  async editPost(id: number, dto: CreatePostDto, req) {
    try {
      const post = await this.postsRepository.findByPk(id, {
        include: Tag,
      });
      if (post.dataValues.userId !== req.user.id) {
        console.log(post.dataValues.userId)
        console.log(req.user.id)
        throw new UnauthorizedException();
      }
      const receivedTags = dto.tags || [];
      const postTags = post.tags;
      const tagsEdited = checkTagsEdited(postTags, receivedTags);

      if (tagsEdited) {
        const convertedTags = receivedTags.map((tag) => {
          return { tag, postId: id };
        });
        await this.tagsRepository.destroy({ where: { postId: id } });
        await this.tagsRepository.bulkCreate(convertedTags);
      }

      post.title = dto.title;
      post.imageUrl = dto.imageUrl;
      post.text = dto.text;

      return await post.save();
    } catch (error) {
      throw error;
    }
  }
}

function convertTags(posts) {
  return posts.map((post) => {
    return {
      ...post,
      tags: post.tags.length ? post.tags.map((tag) => tag.tag) : [],
    };
  });
}

function checkTagsEdited(postTags, receivedTags) {
  const cleanedPostTags = JSON.parse(
    JSON.stringify(postTags.map((item) => item.tag)),
  );
  if (receivedTags.length !== cleanedPostTags.length) {
    return true;
  }
  for (let i in receivedTags) {
    if (receivedTags[i] !== cleanedPostTags[i]) {
      return true;
    }
  }
  return false;
}

function deleteImage(id) {
  try {
    const filePath = path.resolve('uploads', id);
    fs.unlink(filePath, () => {});
    return { success: true };
  } catch (e) {
    return e;
  }
}
