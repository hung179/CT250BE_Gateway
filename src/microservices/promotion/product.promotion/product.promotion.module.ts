import { Module } from '@nestjs/common';
import { ProductPromotionService } from './product.promotion.service';
import { ProductPromotionController } from './product.promotion.controller';

@Module({
  providers: [ProductPromotionService],
  controllers: [ProductPromotionController],
})
export class ProductPromotionModule {}
