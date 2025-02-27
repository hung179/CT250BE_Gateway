import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  CreateKhuyenMaiDto,
  CreateChiTietKhuyenMaiDto,
  UpdateKhuyenMaiDto,
  UpdateChiTietKhuyenMaiDto,
} from './product.promotion.dto';
import { ProductPromotionService } from './product.promotion.service';
import { AdminGuard } from 'src/auth/guards/admin-guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('product-promotion')
export class ProductPromotionController {
  constructor(
    private readonly productPromotionService: ProductPromotionService
  ) {}

  // Tạo khuyến mãi
  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async createKhuyenMai(
    @Body('khuyenMai') khuyenMaiDto: CreateKhuyenMaiDto,
    @Body('chiTietKhuyenMai') chiTietKhuyenMaiDto: CreateChiTietKhuyenMaiDto[]
  ) {
    return this.productPromotionService.create(
      khuyenMaiDto,
      chiTietKhuyenMaiDto
    );
  }

  // Cập nhật khuyến mãi theo ID
  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async update(
    @Param('id') id: string,
    @Body('khuyenMai') khuyenMaiDto: UpdateKhuyenMaiDto,
    @Body('chiTietKhuyenMai') chiTietKhuyenMaiDto: UpdateChiTietKhuyenMaiDto[]
  ) {
    return this.productPromotionService.update(
      id,
      khuyenMaiDto,
      chiTietKhuyenMaiDto
    );
  }

  // Xóa khuyến mãi theo ID
  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async delete(@Param('id') idKhuyenMai: string) {
    return this.productPromotionService.delete(idKhuyenMai);
  }

  // Lấy khuyến mãi có hiệu lực của 1 sản phẩm hoặc nhiều sản phẩm
  @Get('product/:id')
  async getActivePromotionsByProductId(
    @Param('id') idSanPham: string
  ): Promise<any> {
    return this.productPromotionService.getActivePromotionsByProductId(
      idSanPham
    );
  }
  // Lấy khuyến mãi của nhiều sản phẩm
  @Post('product')
  async getActivePromotionsByProductIds(
    @Body('id') idSanPham: string[]
  ): Promise<any> {
    return this.productPromotionService.getActivePromotionsByProductIds(
      idSanPham
    );
  }

  // Lấy sản phẩm tham gia khuyến mãi
  @Get(':id/products')
  async getProductsInPromotion(@Param('id') idKhuyenMai: string): Promise<any> {
    return this.productPromotionService.getProductsInPromotion(idKhuyenMai);
  }

  @Get('active')
  async getActivePromotions() {
    return this.productPromotionService.getActivePromotions();
  }

  // Lấy khuyến mãi (1 theo id hoặc tất cả)
  @Get(':id')
  async find(@Param('id') id: string) {
    return this.productPromotionService.find(id);
  }
}
