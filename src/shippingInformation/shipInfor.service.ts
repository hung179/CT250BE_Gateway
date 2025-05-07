import { Injectable } from '@nestjs/common';
import { ShippingInformationDto } from './shipInfor.dto';
import { RedisMessageBrokerService } from 'src/redisMessageBroker/redisMessageBroker.service';

@Injectable()
export class ShippingInformationService {
  async getAllShippingInformation() {
    return await this.redisMessageBrokerService.requestResponse(
      'get_all_shipping_information',{}
    )
  }
  async getShippingInformationByProvince(tinh: string) {
    return await this.redisMessageBrokerService.requestResponse(
      'get_shipping_information_by_province',
      tinh
    );
  }
  constructor(
    private readonly redisMessageBrokerService: RedisMessageBrokerService,
  ) {}

  async deleteShipInfor(id: string) {
    return await this.redisMessageBrokerService.requestResponse(
      'delete_shipping_information',
      id ,
    );
  }
  async updateShipInfor(ShippingInformation: ShippingInformationDto, id: string) {
    return await this.redisMessageBrokerService.requestResponse(
      'update_shipping_information',
      { ShippingInformation, id },
    );
  }
  async findShipInforById(id: string) {
    return await this.redisMessageBrokerService.requestResponse('get_shipping_information', {
      id,
    });
  }
  async createShipInfor(ShippingInformation: ShippingInformationDto) {
    return await this.redisMessageBrokerService.requestResponse(
      'create_shipping_information',
       ShippingInformation ,
    );
  }
}
