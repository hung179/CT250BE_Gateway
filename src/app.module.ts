import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './microservices/product/product.module';
import { OrderModule } from './microservices/order/order.module';
import { CustomerModule } from './microservices/customer/customer.module';
import { AdminModule } from './microservices/admin/admin.module';
import { CategoryModule } from './microservices/category/category.module';
import { ProductPromotionModule } from './microservices/promotion/product.promotion/product.promotion.module';
import { BillPromotionModule } from './microservices/promotion/bill.promotion/bill.promotion.module';
import { ReviewModule } from './microservices/review/review.module';
import { AttributeModule } from './microservices/attribute/attribute.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ProductModule,
    OrderModule,
    CustomerModule,
    AdminModule,
    CategoryModule,
    ProductPromotionModule,
    BillPromotionModule,
    ReviewModule,
    AttributeModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
