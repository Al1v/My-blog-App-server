import { IsNotEmpty } from 'class-validator';

export class CreateCommenttDto {
  @IsNotEmpty({ message: "The comment can't be empty" })
  readonly text: string;
  readonly postId: number;
}
