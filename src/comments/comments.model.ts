import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../users/users.model';
import { Post } from '../posts/posts.model';

interface CommentCreationAttrs {
  text: string;
  userId: number;
  postId: number;
}

@Table({ tableName: 'comments' })
export class Comment extends Model<Comment, CommentCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  text: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Post)
  @Column({ type: DataType.INTEGER })
  postId: number;

  @BelongsTo(() => Post)
  post: Post;
}
