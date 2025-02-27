import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './product.dto';
import { UpdateProductDto } from './product.dto';
import { RedisMessageBrokerService } from 'src/redisMessageBroker/redisMessageBroker.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly redisMessageBrokerService: RedisMessageBrokerService
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    files: {
      anhBia_SP?: Express.Multer.File[];
      anh_SP?: Express.Multer.File[];
      anh_TC?: Express.Multer.File[];
    }
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    return await this.redisMessageBrokerService.requestResponse(
      'product_create',
      { createProductDto, files }
    );
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
    files: {
      anhBiaCapNhat_SP?: Express.Multer.File[];
      anhMoi_SP?: Express.Multer.File[];
      anhMoi_TC?: Express.Multer.File[];
      anhCapNhat_SP?: Express.Multer.File[];
      anhCapNhat_TC?: Express.Multer.File[];
    }
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    return await this.redisMessageBrokerService.requestResponse(
      'product_update',
      { id, updateProductDto, files }
    );
  }

  async deleteProduct(
    id: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    return await this.redisMessageBrokerService.requestResponse(
      'product_delete',
      id
    );
  }

  async getProductSalesInf(
    idSalesInf: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    return await this.redisMessageBrokerService.requestResponse(
      'product_get-sale-info',
      idSalesInf
    );
  }

  async getMultipleProductSalesInf(
    idSalesInf: string[]
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    return await this.redisMessageBrokerService.requestResponse(
      'product_get-multiple-sale-info',
      idSalesInf
    );
  }

  async searchProduct(data: {
    id?: string;
    searchKey?: string;
    code?: number;
    limit?: number;
    page?: number;
  }): Promise<{ success: boolean; data?: any; error?: string }> {
    return await this.redisMessageBrokerService.requestResponse(
      'product_search',
      data
    );
  }
}
