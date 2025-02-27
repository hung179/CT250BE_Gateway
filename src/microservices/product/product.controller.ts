import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { AdminGuard } from 'src/auth/guards/admin-guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'anhBia_SP', maxCount: 1 }, // Ảnh bìa (chỉ 1 ảnh)
      { name: 'anh_SP', maxCount: 9 }, // Nhận tối đa 4 ảnh sản phẩm
      { name: 'anh_TC', maxCount: 10 }, // Nhận tối đa 10 ảnh tùy chọn
    ])
  )
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles()
    files: {
      anhBia_SP?: Express.Multer.File[];
      anh_SP?: Express.Multer.File[];
      anh_TC?: Express.Multer.File[];
    }
  ) {
    return this.productService.createProduct(createProductDto, files);
  }
  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'anhBiaCapNhat_SP', maxCount: 1 },
      { name: 'anhMoi_SP', maxCount: 9 },
      { name: 'anhMoi_TC', maxCount: 10 },
      { name: 'anhCapNhat_SP', maxCount: 4 },
      { name: 'anhCapNhat_TC', maxCount: 10 },
    ])
  )
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles()
    files: {
      anhBiaCapNhat_SP?: Express.Multer.File[];
      anhMoi_SP?: Express.Multer.File[];
      anhMoi_TC?: Express.Multer.File[];
      anhCapNhat_SP?: Express.Multer.File[];
      anhCapNhat_TC?: Express.Multer.File[];
    }
  ) {
    return this.productService.updateProduct(id, updateProductDto, files);
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
  @Get('sale-inf/:id')
  @UseGuards(JwtAuthGuard)
  async getSalesInf(@Param('id') idSalesInf: string) {
    return this.productService.getProductSalesInf(idSalesInf);
  }
  @Post('sale-inf')
  @UseGuards(JwtAuthGuard)
  async getMultipleSalesInf(@Body('idSalesInf') idSalesInf: string[]) {
    return this.productService.getMultipleProductSalesInf(idSalesInf);
  }
  @Get(':id')
  async getProduct(
    @Param('id') id: string,
    @Query('searchKey') searchKey: string,
    @Query('code') code: number,
    @Query('l') limit: number = 12,
    @Query('p') page: number = 0
  ) {
    const data = { id, searchKey, code, limit, page };
    return this.productService.searchProduct(data);
  }
}
