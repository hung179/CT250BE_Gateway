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
import { MaGiamDTO } from './bill.promotion.dto';
import { BillPromotionService } from './bill.promotion.service';
import { AdminGuard } from 'src/auth/guards/admin-guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('bill-promotion')
@UseGuards(JwtAuthGuard)
export class BillPromotionController {
  constructor(private readonly billPromotionService: BillPromotionService) {}

  @Get('user/:id')
  async findAll(@Param('id') idKhachhang: string) {
    return this.billPromotionService.findUsable(idKhachhang);
  }

  @Get(':id')
  async find(@Param('id') id: string): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    return this.billPromotionService.find(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() dto: MaGiamDTO): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    return this.billPromotionService.create(dto);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: Partial<MaGiamDTO>
  ): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    return this.billPromotionService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: string): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    return this.billPromotionService.delete(id);
  }
}
