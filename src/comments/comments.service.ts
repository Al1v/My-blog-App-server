import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from 'src/posts/posts.model';
import { User } from 'src/users/users.model';
import { Comment } from './comments.model';
import { CreateCommenttDto } from './dto/comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment)
    private commentsRepository: typeof Comment,
  ) {}

  async getCommentsByPostId(id: number) {
    try {
      const where = id ? { postId: id } : {};
      return await this.commentsRepository.findAll({
        where: where,
        include: [
          {
            model: User,
            attributes: ['id', 'fullName', 'email', 'avatarUrl'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });
    } catch (error) {
      throw error;
    }
  }

  async getLastComments() {
    return await this.commentsRepository.findAll({
      include: {
        model: User,
        attributes: ['id', 'fullName', 'email', 'avatarUrl'],
      },
      order: [['createdAt', 'DESC']],
      limit: 7,
    });
  }

  async newComment(dto: CreateCommenttDto, req) {
    try {
      const userId = req.user.id;
      const newComment = await this.commentsRepository.create({
        ...dto,
        userId,
      });
      const user = await newComment.$get('user', {
        attributes: ['id', 'fullName', 'email', 'avatarUrl'],
      });
      const convertedComment = newComment.toJSON();
      convertedComment.user = user.toJSON();

      return convertedComment;
    } catch (error) {
      throw error;
    }
  }

  async deleteComment(id: number, req) {
    try {
      const comment = await this.commentsRepository.findByPk(id);
      if (!comment) return;
      if (comment.dataValues.userId !== req.user.id) {
        return new UnauthorizedException();
      }
      const result = await this.commentsRepository.destroy({
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
}
