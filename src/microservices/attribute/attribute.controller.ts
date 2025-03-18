import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AttributeDto } from './attribute.dto';
import { AttributeService } from './attribute.service';

@Controller('attributes')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}
  @Get()
  async getProductAttribute() {
    return this.attributeService.findAttributeAll();
  }

  @Post()
  async addProductAttribute(@Body() attributeDto: AttributeDto) {
    return this.attributeService.createAttribute(attributeDto);
  }

  @Get(':id')
  async getProductAttributeById(@Param('id') id: string) {
    return this.attributeService.findAttributeById(id);
  }

  @Put(':id')
  async updateProductAttributeById(
    @Body() attributeDto: AttributeDto,
    @Param('id') id: string
  ) {
    return this.attributeService.updateAttribute(attributeDto, id);
  }

  @Delete(':id')
  async deleteProductAttributeById(@Param('id') id: string) {
    return this.attributeService.deleteAttribute(id);
  }
}
