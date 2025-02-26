import { Injectable } from '@nestjs/common';
import { RedisMessageBrokerService } from 'src/redisMessageBroker/redisMessageBroker.service';
import {
  CreateKhuyenMaiDto,
  CreateChiTietKhuyenMaiDto,
  UpdateKhuyenMaiDto,
  UpdateChiTietKhuyenMaiDto,
} from './product.promotion.dto';

@Injectable()
export class ProductPromotionService {
  constructor(
    private readonly redisMessageBrokerService: RedisMessageBrokerService
  ) {}

  async create(
    khuyenMaiDto: CreateKhuyenMaiDto,
    chiTietKhuyenMaiDto: CreateChiTietKhuyenMaiDto[]
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    return await this.redisMessageBrokerService.requestResponse(
      'product-promotion_create',
      { khuyenMaiDto, chiTietKhuyenMaiDto }
    );
  }

  async update(
    idKhuyenMai: string,
    khuyenMaiDto: UpdateKhuyenMaiDto,
    chiTietKhuyenMaiDto: UpdateChiTietKhuyenMaiDto[]
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    return await this.redisMessageBrokerService.requestResponse(
      'product-promotion_update',
      { idKhuyenMai, khuyenMaiDto, chiTietKhuyenMaiDto }
    );
  }

  async delete(
    idKhuyenMai: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    return await this.redisMessageBrokerService.requestResponse(
      'product-promotion_delete',
      idKhuyenMai
    );
  }

  async find(
    idKhuyenMai: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    return await this.redisMessageBrokerService.requestResponse(
      'product-promotion_find',
      idKhuyenMai
    );
  }

  async getActivePromotions(): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    return await this.redisMessageBrokerService.requestResponse(
      'product-promotion_get-active-promotions'
    );
  }

  async getProductsInPromotion(
    idKhuyenMai: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    return await this.redisMessageBrokerService.requestResponse(
      'product-promotion_get-products-in-promotion',
      idKhuyenMai
    );
  }

  async getActivePromotionsByProductId(
    idSanPham: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    return await this.redisMessageBrokerService.requestResponse(
      'product-promotion_get-active-promotions-by-productId',
      idSanPham
    );
  }

  async getActivePromotionsByProductIds(
    idSanPham: string[]
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    return await this.redisMessageBrokerService.requestResponse(
      'product-promotion_get-active-promotions-by-productIds',
      idSanPham
    );
  }
}
