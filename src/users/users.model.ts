import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Comment } from 'src/comments/comments.model';
import { Like } from 'src/likes/likes.model';
import { Post } from '../posts/posts.model';

interface UserCreationAttrs {
  fullName: string;
  email: string;
  password: string;
  avatarUrl: string;
}

@Table({ tableName: 'users', timestamps: false })
export class User extends Model<User, UserCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  fullName: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING, allowNull: true })
  avatarUrl: string;

  @HasMany(() => Post, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true,
  })
  posts: Post[];

  @HasMany(() => Comment, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true,
  })
  comments: Comment[];

  @HasMany(() => Like, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    hooks: true,
  })
  likes: Like[];
}
