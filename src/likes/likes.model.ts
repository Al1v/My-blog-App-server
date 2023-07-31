import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Comment } from 'src/comments/comments.model';
import { Post } from 'src/posts/posts.model';
import { Tag } from 'src/tags/tags.model';
import { User } from '../users/users.model';

interface LikeCreationAttrs {
  postId: number;
  userId: number;
}

@Table({ tableName: 'likes', timestamps: false })
export class Like extends Model<Like, LikeCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Post)
  @Column({ type: DataType.INTEGER, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  postId: number;

  @BelongsTo(() => Post)
  post: Post;
}
