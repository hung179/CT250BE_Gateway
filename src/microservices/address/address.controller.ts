import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { AddressDto } from "./address.dto";
import { AddressesService } from "./address.service";

@Controller('addresses')
export class AddressesController{
    constructor(private readonly addressService: AddressesService){}
      @Get()
      getAllAddress() {    
        return this.addressService.findAllAddress();
      }
      @Get('user/:id')
      getUserAddresses(@Param('id') userId: string) {
        return this.addressService.findAddressByUserId(userId);
      }
      @Get(':id')
      getAddressById(@Param('id') id: string) {
        return this.addressService.findAddressById(id);
      }
    
      // Tìm kiếm các địa chỉ theo id người dùng
      @Post()
      createAddress(@Body() address: AddressDto) {
        return this.addressService.createAddress(address);
      }
    
      @Put(':id')
      updateAddress(@Param('id') id: string, @Body() address: AddressDto) {
        return this.addressService.updateAddress(address, id);
      }
    
      @Delete(':id')
      deleteAddress(@Param('id') id: string) {
        return this.addressService.deleteAddress(id);
      }
    
}