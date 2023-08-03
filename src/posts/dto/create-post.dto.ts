import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty({ message: "The title field can't be empty" })
  readonly title: string;
  @IsNotEmpty({ message: "The text field can't be empty" })
  readonly text: string;
  readonly userId: number;
  readonly imageUrl: string;
  readonly tags: [string];
}
