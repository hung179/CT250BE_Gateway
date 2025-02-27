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
import { CreateHoaDonDto } from './order.dto';
import { AdminGuard } from 'src/auth/guards/admin-guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('order')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post()
  async createOrder(@Body() createHoaDonDto: CreateHoaDonDto) {
    return await this.orderService.create(createHoaDonDto);
  }
  @Put(':id')
  async updateStateOrder(
    @Param('id') idSanPham: string,
    @Query('s') state: number
  ) {
    return this.orderService.updateState(idSanPham, state);
  }
  @Delete(':id')
  @UseGuards(AdminGuard)
  async cancelOrder(@Param('id') idSanPham: string) {
    return this.orderService.confirmCancel(idSanPham);
  }
  @Get()
  async getAllOrders(@Query('s') state: number = 0) {
    return this.orderService.findAll(state);
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
