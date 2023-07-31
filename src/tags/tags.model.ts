import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Post } from 'src/posts/posts.model';

interface TagCreationAttrs {
  postId: number;
  tags: [string];
}

@Table({ tableName: 'tags', timestamps: false })
export class Tag extends Model<Tag, TagCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, unique: false, allowNull: false })
  tag: string;

  @ForeignKey(() => Post)
  @Column({ type: DataType.INTEGER, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  postId: number;

  @BelongsTo(() => Post)
  post: Post;
}
