import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PostsListingDto } from './model.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  posts(page: number, pageSize: number): PostsListingDto {
    // Mock data for demonstration
    const mockPosts = Array.from({ length: pageSize }, (_, i) => ({
      id: `post-${i + 1}`,
      title: `Post ${i + 1}`,
      content: `This is the content for post ${i + 1}`,
    }));

    return {
      data: mockPosts,
      nextPage: mockPosts.length === pageSize ? page + 1 : null,
    };
  }
}
