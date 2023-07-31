import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Like } from './likes.model';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Like)
    private likesRepository: typeof Like,
  ) {}

  async setLike(params, request) {
    try {
      const postId = +params.id;
      const userId = request?.user?.id;

      const dbRes = await this.likesRepository.findCreateFind({
        where: { userId, postId },
      });

      const newLike = dbRes[1];

      if (newLike) {
        return { liked: true };
      }
      const dbRes2 = await this.likesRepository.destroy({
        where: { userId, postId },
      });
      console.log({ dbRes2 });
      return { liked: false };
    } catch (error) {
      throw error;
    }
  }

  getLikesList(postId) {
    const postLikes = likes.find((post) => post.postId == postId);
    if (!postLikes) {
      const newPostLikes: PostLikes = { postId, users: [] };
      likes.push(newPostLikes);
      return likes.find((post) => post.postId == postId).users;
    }

    return postLikes.users;
  }

  getLikesNumber(postId) {
    console.log('getLikesNumber');
    console.log(this.getLikesList(postId).length);
    return this.getLikesList(postId).length || 0;
  }
}

const likes: Likes = [{ postId: 1, users: [1, 2, 3, 4, 5] }];

type PostLikes = {
  postId: number;
  users: number[];
};

type Likes = PostLikes[];
