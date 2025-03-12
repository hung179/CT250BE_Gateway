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
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post()
  //@UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'fileAnhBia_SP', maxCount: 1 }, // Ảnh bìa (chỉ 1 ảnh)
      { name: 'fileAnh_SP', maxCount: 10 }, // Nhận tối đa 4 ảnh sản phẩm
    ])
  )
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles()
    files: {
      fileAnhBia_SP?: Express.Multer.File[];
      fileAnh_SP?: Express.Multer.File[];
    }
  ) {
    return this.productService.createProduct(createProductDto, files);
  }
  @Put(':id')
  //@UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'fileAnhBia_SP', maxCount: 1 }, // Ảnh bìa (chỉ 1 ảnh)
      { name: 'fileAnh_SP', maxCount: 10 }, // Nhận tối đa 4 ảnh sản phẩm
    ])
  )
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles()
    files: {
      fileAnhBia_SP?: Express.Multer.File[];
      fileAnh_SP?: Express.Multer.File[];
    }
  ) {
    console.log(updateProductDto, files);
    return this.productService.updateProduct(id, updateProductDto, files);
  }
  @Delete(':id')
  //@UseGuards(JwtAuthGuard, AdminGuard)
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }
  @Get('sale-inf/:id')
  @UseGuards(JwtAuthGuard)
  async getSalesInf(@Param('id') idSalesInf: string) {
    return this.productService.getProductSalesInf(idSalesInf);
  }

  @Get('all')
  async getAll(
    @Query('limit') limit: string = '12',
    @Query('page') page: string = '0',
    @Query('state') state: string = '1'
  ) {
    const data = {
      limit: parseInt(limit, 10) || 12, // Nếu không hợp lệ, gán giá trị mặc định
      page: parseInt(page, 10) ?? 0,
      state: parseInt(state, 10) ?? 1,
    };
    console.log(state, data.state);
    return this.productService.getAllProduct(data);
  }

  @Post('sale-inf')
  @UseGuards(JwtAuthGuard)
  async getMultipleSalesInf(@Body('idSalesInf') idSalesInf: string[]) {
    return this.productService.getMultipleProductSalesInf(idSalesInf);
  }
  @Get(':id')
  async getProductID(@Param('id') id: string) {
    const data = { id };
    console.log(data);
    return this.productService.productDetail(data);
  }

  @Get('')
  async getProduct(
    @Query('searchKey') searchKey?: string,
    @Query('code') code?: string,
    @Query('category') category?: string,
    @Query('limit') limit: string = '12',
    @Query('page') page: string = '0',
    @Query('state') state: string = '1'
  ) {
    const data = {
      searchKey,
      code: code ? Number(code) : undefined, // Chỉ ép kiểu nếu có giá trị
      category,
      limit: parseInt(limit, 10) || 12, // Nếu không hợp lệ, gán giá trị mặc định
      page: parseInt(page, 10) ?? 0,
      state: parseInt(state, 10) ?? 1,
    };
    return this.productService.searchProduct(data);
  }

  @Put('state/:id')
  async updateState(@Param('id') id: string, @Body() body: { state: boolean }) {
    const state = body.state;
    console.log(this.productService.updateState({ id, state }));
    return this.productService.updateState({ id, state });
  }
}
