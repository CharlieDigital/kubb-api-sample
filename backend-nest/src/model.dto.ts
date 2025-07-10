export class PostDto {
  id: string;
  title: string;
  content: string;
}

export class PostsListingDto {
  data: PostDto[];
  nextPage: number | null;
}
