import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateDonHangDto } from './order.dto';
import { AdminGuard } from 'src/auth/guards/admin-guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('order')
//@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post()
  async createOrder(@Body() createHoaDonDto: any) {
    return await this.orderService.create(createHoaDonDto);
  }
  @Put(':id')
  async updateStateOrder(
    @Param('id') idSanPham: string,
    @Query('state') state: string
  ) {
    const data = {
      state: parseInt(state, 10) ?? 1,
    };
    return this.orderService.updateState(idSanPham, data.state);
  }
  @Delete(':id')
  // @UseGuards(AdminGuard)
  async cancelOrder(@Param('id') idSanPham: string) {
    return this.orderService.confirmCancel(idSanPham);
  }
  @Get()
  async getAllOrders(
    @Query('limit') limit: string = '12',
    @Query('page') page: string = '0',
    @Query('state') state: string = '1'
  ) {
    // Dùng database bản thân để sử dụng dữ liệu
    const data = {
      limit: parseInt(limit, 10) || 12, // Nếu không hợp lệ, gán giá trị mặc định
      page: parseInt(page, 10) ?? 0,
      state: parseInt(state, 10) ?? 1,
    };
    return this.orderService.findAll(data);
  }
  @Get(':id')
  async getOrder(@Param('id') idOrder: string) {
    return this.orderService.findOne(idOrder);
  }
  @Get('user/:id')
  async getUserOrders(@Param('id') idUser: string) {
    return this.orderService.findUserOrders(idUser);
  }
}
