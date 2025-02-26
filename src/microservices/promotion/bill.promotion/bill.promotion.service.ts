import { Injectable } from '@nestjs/common';
import { RedisMessageBrokerService } from 'src/redisMessageBroker/redisMessageBroker.service';
import { MaGiamDTO } from './bill.promotion.dto';

@Injectable()
export class BillPromotionService {
  constructor(
    private readonly redisMessageBrokerService: RedisMessageBrokerService
  ) {}

  async find(id: string): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    return await this.redisMessageBrokerService.requestResponse(
      'bill-promotion_find',
      id
    );
  }

  async create(dto: MaGiamDTO): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    return await this.redisMessageBrokerService.requestResponse(
      'bill-promotion_create',
      dto
    );
  }

  async update(
    id: string,
    dto: Partial<MaGiamDTO>
  ): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    return await this.redisMessageBrokerService.requestResponse(
      'bill-promotion_update',
      { id, dto }
    );
  }

  async delete(id: string): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    return await this.redisMessageBrokerService.requestResponse(
      'bill-promotion_delete',
      id
    );
  }

  async findUsable(idKhachHang: string): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    return await this.redisMessageBrokerService.requestResponse(
      'bill-promotion_find-usable-user',
      idKhachHang
    );
  }
}
