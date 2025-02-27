import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateReviewDto } from './review.dto';
import { ReviewService } from './review.service';
import { AdminGuard } from 'src/auth/guards/admin-guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  async createReview(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.createReview(createReviewDto);
  }

  @Get(':id')
  async getReviewsProduct(
    @Param('id') productId: string,
    @Query('p') page: number = 0,
    @Query('l') limit: number = 10
  ) {
    return this.reviewService.getReviewsByProduct(
      productId,
      Number(page),
      Number(limit)
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deleteReview(@Param('id') id: string) {
    return this.reviewService.deleteReview(id);
  }
}
