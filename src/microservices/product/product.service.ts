import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './product.dto';
import { UpdateProductDto } from './product.dto';
import { RedisMessageBrokerService } from 'src/redisMessageBroker/redisMessageBroker.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly redisMessageBrokerService: RedisMessageBrokerService
  ) {}
  async restock(
    ttSanPham: {
      idSanPham_CTDH: string;
      idTTBanHang_CTDH: string;
      tenSanPham_CTDH: string;
      soLuong_CTDH: number;
      giaMua_CTDH: number;
    }[]
  ) {
    return await this.redisMessageBrokerService.requestResponse(
      'hoan_kho_san_pham',
      ttSanPham
    );
  }
  async reduceStock(
    ttSanPham: {
      idSanPham_CTDH: string;
      idTTBanHang_CTDH: string;
      tenSanPham_CTDH: string;
      soLuong_CTDH: number;
      giaMua_CTDH: number;
    }[]
  ) {
    return await this.redisMessageBrokerService.requestResponse(
      'giam_kho_san_pham',
      ttSanPham
    );
  }

  async createProduct(
    createProductDto: CreateProductDto,
    files: {
      fileAnhBia_SP?: Express.Multer.File[];
      fileAnh_SP?: Express.Multer.File[];
    }
  ): Promise<{ success: boolean; data?: any; error?: any }> {
    const convertFile = (file?: Express.Multer.File[]) =>
      file?.map((f) => ({
        originalname: f.originalname,
        mimetype: f.mimetype,
        buffer: f.buffer.toString('base64'), // Chuyển thành base64
      })) || [];

    const payload = {
      createProductDto,
      files: {
        fileAnhBia_SP: convertFile(files.fileAnhBia_SP)?.[0] || null, // Chỉ lấy 1 ảnh bìa
        fileAnh_SP: convertFile(files.fileAnh_SP),
      },
    };
    return await this.redisMessageBrokerService.requestResponse(
      'product_create',
      payload
    );
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
    files: {
      fileAnhBia_SP?: Express.Multer.File[];
      fileAnh_SP?: Express.Multer.File[];
    }
  ): Promise<{ success: boolean; data?: any; error?: any }> {
    const convertFile = (file?: Express.Multer.File[]) =>
      file?.map((f) => ({
        originalname: f.originalname,
        mimetype: f.mimetype,
        buffer: f.buffer.toString('base64'), // Chuyển thành base64
      })) || [];

    const payload = {
      id,
      updateProductDto,
      files: {
        fileAnhBia_SP: convertFile(files.fileAnhBia_SP)?.[0] || null, // Chỉ lấy 1 ảnh bìa
        fileAnh_SP: convertFile(files.fileAnh_SP),
      },
    };
    return await this.redisMessageBrokerService.requestResponse(
      'product_update',
      payload
    );
  }

  async deleteProduct(
    id: string
  ): Promise<{ success: boolean; data?: any; error?: any }> {
    return await this.redisMessageBrokerService.requestResponse(
      'product_delete',
      id
    );
  }

  async getProductSalesInf(
    idSalesInf: string
  ): Promise<{ success: boolean; data?: any; error?: any }> {
    return await this.redisMessageBrokerService.requestResponse(
      'product_get-sale-info',
      idSalesInf
    );
  }

  async getMultipleProductSalesInf(
    idSalesInf: string[]
  ): Promise<{ success: boolean; data?: any; error?: any }> {
    return await this.redisMessageBrokerService.requestResponse(
      'product_get-multiple-sale-info',
      idSalesInf
    );
  }

  async searchProduct(payload: {
    searchKey?: string;
    category?: string;
    code?: number;
    limit?: number;
    page?: number;
    state: number;
  }): Promise<{ success: boolean; data?: any; error?: any }> {
    return await this.redisMessageBrokerService.requestResponse(
      'product_search',
      payload
    );
  }

  async productDetail(payload: {
    id: string;
  }): Promise<{ success: boolean; data?: any; error?: any }> {
    return await this.redisMessageBrokerService.requestResponse(
      'product_detail',
      payload
    );
  }

  async getAllProduct(payload: {
    limit?: number;
    page?: number;
    state: number;
  }): Promise<{ success: boolean; data?: any; error?: any }> {
    return await this.redisMessageBrokerService.requestResponse(
      'product_get-all',
      payload
    );
  }

  async updateState(payload: {
    id: string;
    state: boolean;
  }): Promise<{ success: boolean; data?: any; error?: any }> {
    return await this.redisMessageBrokerService.requestResponse(
      'product_update-state',
      payload
    );
  }
}
