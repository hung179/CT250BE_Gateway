import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './microservices/product/product.module';
import { OrderModule } from './microservices/order/order.module';
import { CustomerModule } from './microservices/customer/customer.module';
import { AdminModule } from './microservices/admin/admin.module';
import { CategoryModule } from './microservices/category/category.module';
import { PromotionController } from './microservices/promotion/promotion.controller';
import { PromotionModule } from './microservices/promotion/promotion.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ProductModule,
    OrderModule,
    CustomerModule,
    AdminModule,
    CategoryModule,
    PromotionModule,
  ],
  controllers: [PromotionController],
  providers: [],
})
export class AppModule {}
