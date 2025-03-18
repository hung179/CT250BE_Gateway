import { Injectable } from '@nestjs/common';
import { RedisMessageBrokerService } from 'src/redisMessageBroker/redisMessageBroker.service';
import { CreateDonHangDto } from './order.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly redisMessageBrokerService: RedisMessageBrokerService
  ) {}

  async create(
    createHoaDonDto: CreateDonHangDto
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    return await this.redisMessageBrokerService.requestResponse(
      'order_create',
      createHoaDonDto
    );
  }

  async updateState(
    idSanPham: string,
    state: number
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    return await this.redisMessageBrokerService.requestResponse(
      'order_update',
      { idSanPham, state }
    );
  }

  async confirmCancel(
    idSanPham: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    return await this.redisMessageBrokerService.requestResponse(
      'order_confirm-cancel',
      idSanPham
    );
  }

  async findAll(payload: {
    limit?: number;
    page?: number;
    state: number;
  }): Promise<{ success: boolean; data?: any; error?: string }> {
    return await this.redisMessageBrokerService.requestResponse(
      'order_find-all',
      payload
    );
  }

  async findOne(
    id: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    return await this.redisMessageBrokerService.requestResponse(
      'order_find-one',
      id
    );
  }

  async findUserOrders(
    idUser: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    return await this.redisMessageBrokerService.requestResponse(
      'order_find-user-orders',
      idUser
    );
  }
}
