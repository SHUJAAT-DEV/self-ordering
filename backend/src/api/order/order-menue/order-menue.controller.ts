import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderMenueService } from './order-menue.service';
import { CreateOrderMenueDto } from './dto/create-order-menue.dto';

@Controller('order-menue')
export class OrderMenueController {
  constructor(private readonly orderMenueService: OrderMenueService) {}

  @Post()
  create(@Body() createOrderMenueDto: CreateOrderMenueDto) {
    return this.orderMenueService.create(createOrderMenueDto);
  }
}
