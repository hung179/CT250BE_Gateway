import { Injectable } from '@nestjs/common';
import { RedisMessageBrokerService } from 'src/redisMessageBroker/redisMessageBroker.service';
import { CreateHoaDonDto } from './order.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly redisMessageBrokerService: RedisMessageBrokerService
  ) {}

  async create(
    createHoaDonDto: CreateHoaDonDto
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

  async findAll(
    state: number = 0
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    return await this.redisMessageBrokerService.requestResponse(
      'order_find_all',
      state
    );
  }

  async findOne(
    id: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    return await this.redisMessageBrokerService.requestResponse(
      'order_find_one',
      id
    );
  }

  async findUserOrders(
    idUser: string
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    return await this.redisMessageBrokerService.requestResponse(
      'order_find_user_orders',
      idUser
    );
  }

  async test(data: string) {
    return await this.redisMessageBrokerService.requestResponse(
      'order_test',
      data
    );
  }
}
