import { Injectable } from '@nestjs/common';
import { RedisMessageBrokerService } from 'src/redisMessageBroker/redisMessageBroker.service';
import { AdminDto } from './admin.dto';

@Injectable()
export class AdminService {
  async getInformation() {
    return await this.redisMessageBrokerService.requestResponse('get_book_store_information', {} );
  }
  async deleteBookStore(id: string) {
    return await this.redisMessageBrokerService.requestResponse('delete_book_store',  id );
  }
  async updateBookStore(admin: AdminDto, id: string) {
    return await this.redisMessageBrokerService.requestResponse('update_book_store', {
      admin,
      id,
    });
  }
  async createBookStore(admin: AdminDto) {
    return await this.redisMessageBrokerService.requestResponse('create_book_store',
      admin);
  }
  async findBookStoreByUserName(username: string) {
    return await this.redisMessageBrokerService.requestResponse('get_book_store_by_username', username );
  }
  async findBookStoreById(id: string) {
    return await this.redisMessageBrokerService.requestResponse('get_book_store_by_id', id );
  }
  constructor(
    private readonly redisMessageBrokerService: RedisMessageBrokerService,
  ) {}
}
