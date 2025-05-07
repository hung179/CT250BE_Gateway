import { Injectable } from '@nestjs/common';
import { RedisMessageBrokerService } from 'src/redisMessageBroker/redisMessageBroker.service';
import { AddressDto } from './address.dto';

@Injectable()
export class AddressesService {
  constructor(
    private readonly redisMessageBrokerService: RedisMessageBrokerService,
  ) {}

  async findAllAddress() {
    return await this.redisMessageBrokerService.requestResponse('get_all_addresses', {});
  }
  async deleteAddress(id: string) {
    return await this.redisMessageBrokerService.requestResponse('delete_address', id);
  }
  async updateAddress(address: AddressDto, id: string) {
    return await this.redisMessageBrokerService.requestResponse('update_address', {
      address,
      id,
    });
  }
  async createAddress(address: AddressDto) {
    return await this.redisMessageBrokerService.requestResponse('create_address',
      address);
  }
  async findAddressByUserId(userId: string) {
    return await this.redisMessageBrokerService.requestResponse('get_user_addresses', 
      userId);
  }
  async findAddressById(id: string) {
    return await this.redisMessageBrokerService.requestResponse('get_address_by_id', id );
  }
}
