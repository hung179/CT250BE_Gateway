import { Injectable } from '@nestjs/common';
import { RedisMessageBrokerService } from 'src/redisMessageBroker/redisMessageBroker.service';
import { CreateReviewDto } from './review.dto';

@Injectable()
export class ReviewService {
  constructor(
    private readonly redisMessageBrokerService: RedisMessageBrokerService
  ) {}

  async createReview(
    createReviewDto: CreateReviewDto
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    return await this.redisMessageBrokerService.requestResponse(
      'review_create',
      createReviewDto
    );
  }

  async getReviewsByProduct(
    productId: string,
    page = 0,
    limit = 10
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    return await this.redisMessageBrokerService.requestResponse(
      'review_get-product',
      { productId, page, limit }
    );
  }

  async deleteReview(
    id: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    return await this.redisMessageBrokerService.requestResponse(
      'review_delete-all-product',
      id
    );
  }
}
