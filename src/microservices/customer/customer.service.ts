import { Injectable } from '@nestjs/common';
import { RedisMessageBrokerService } from 'src/redisMessageBroker/redisMessageBroker.service';

@Injectable()
export class CustomerService {
  constructor(
    private readonly redisMessageBrokerService: RedisMessageBrokerService
  ) {}
  async findUserByEmail(email: string) {
    return await this.redisMessageBrokerService.requestResponse(
      'get_user_by_email',
      email,
    );
  }
  async findUserById(customerId: string) {
    return await this.redisMessageBrokerService.requestResponse(
      'get_user_by_id',
      { id: customerId }
    );
  }

  async createUser(user: any) {
    return await this.redisMessageBrokerService.requestResponse(
      'create_user',
      user
    );
  }

  async updateUser(userUpdate: any, id: string) {
    return await this.redisMessageBrokerService.requestResponse(
      'update_user_by_id',
      { userUpdate, id }
    );
  }
  async deleteUser(id: string) {
    return await this.redisMessageBrokerService.requestResponse(
      'delete_user_by_id',
      { id }
    );
  }

  async getCart(idKhachHang: string) {
    return await this.redisMessageBrokerService.requestResponse('cart_get', {
      idKhachHang,
    });
  }

  async addToCart(
    idKhachHang: string,
    idSanPham: string,
    idTTBanHang: string,
    soLuong: number
  ) {
    return await this.redisMessageBrokerService.requestResponse('cart_add', {
      idKhachHang,
      idSanPham,
      idTTBanHang,
      soLuong,
    });
  }

  async removeFromCart(
    idKhachHang: string,
    products: { idSanPham_GH: string; idTTBanHang_GH: string }[]
  ) {
    return await this.redisMessageBrokerService.requestResponse('cart_remove', {
      idKhachHang,
      products,
    });
  }
}
