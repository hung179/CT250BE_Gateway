import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CustomerService } from './customer.service';

@Controller('customers')
export class CustomerController {
  cartService: any;
  constructor(private readonly customerService: CustomerService) {}

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.customerService.findUserById(id);
  }

  @Post()
  createUser(@Body() user: any) {
    return this.customerService.createUser(user);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() user: any) {
    return this.customerService.updateUser(user, id);
  }

  @Get('cart/:id')
  async getCart(@Param('id') idKhachHang: string) {
    return this.customerService.getCart(idKhachHang);
  }

  // Thêm sản phẩm vào giỏ hàng
  @Post('cart')
  async addToCart(
    @Body()
    data: {
      idKhachHang: string;
      idSanPham: string;
      idTTBanHang: string;
      soLuong: number;
    }
  ) {
    return this.customerService.addToCart(
      data.idKhachHang,
      data.idSanPham,
      data.idTTBanHang,
      data.soLuong
    );
  }

  // Xóa sản phẩm khỏi giỏ hàng
  @Post('cart/remove')
  async removeFromCart(
    @Body()
    data: {
      idKhachHang: string;
      products: { idSanPham_GH: string; idTTBanHang_GH: string }[];
    }
  ) {
    return this.customerService.removeFromCart(data.idKhachHang, data.products);
  }
}
