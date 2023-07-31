export class CreatePostDto {
  readonly title: string;
  readonly text: string;
  readonly userId: number;
  readonly imageUrl: string;
  readonly tags: [string];
  readonly viewsCount: number;
  readonly commentsCount: number;
}
