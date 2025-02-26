import { Module } from '@nestjs/common';
import { BillPromotionService } from './bill.promotion.service';
import { BillPromotionController } from './bill.promotion.controller';

@Module({
  providers: [BillPromotionService],
  controllers: [BillPromotionController],
})
export class BillPromotionModule {}
