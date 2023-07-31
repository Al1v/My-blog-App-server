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
import { Like } from 'src/likes/likes.model';
import { Tag } from 'src/tags/tags.model';
import { User } from '../users/users.model';

interface PostCreationAttrs {
  title: string;
  text: string;
  userId: number;
  imageUrl: string;
  tags: Array<object>;
  date: string;
  viewsCount: number;
  commentsCount: number;
}

@Table({ tableName: 'posts' })
export class Post extends Model<Post, PostCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING, allowNull: false })
  text: string;

  @Column({ type: DataType.STRING, allowNull: true })
  imageUrl: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  viewsCount: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Tag, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  tags: Tag[];

  @HasMany(() => Comment, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  comments: Comment[];

  @HasMany(() => Like, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  likes: Like[];
}
