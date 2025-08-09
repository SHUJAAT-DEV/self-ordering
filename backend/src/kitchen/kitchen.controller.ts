import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { KitchenService } from './kitchen.service';
import { OrderStatus } from '../orders/entities/order.entity';
import { OrderItemStatus } from '../orders/entities/order-item.entity';

@Controller('kitchen')
export class KitchenController {
  constructor(private kitchenService: KitchenService) {}

  @Get('orders')
  async getKitchenOrders() {
    return this.kitchenService.getKitchenOrders();
  }

  @Get('orders/status/:status')
  async getOrdersByStatus(@Param('status') status: OrderStatus) {
    return this.kitchenService.getOrdersByStatus(status);
  }

  @Post('orders/:id/start')
  async startPreparingOrder(
    @Param('id') orderId: number,
    @Body('userId') userId?: number,
  ) {
    return this.kitchenService.startPreparingOrder(orderId, userId);
  }

  @Post('orders/:id/ready')
  async markOrderReady(
    @Param('id') orderId: number,
    @Body('userId') userId?: number,
  ) {
    return this.kitchenService.markOrderReady(orderId, userId);
  }

  @Post('order-items/:id/status')
  async updateOrderItemStatus(
    @Param('id') itemId: number,
    @Body() updateDto: { status: OrderItemStatus; userId?: number },
  ) {
    return this.kitchenService.updateOrderItemStatus(
      itemId,
      updateDto.status,
      updateDto.userId,
    );
  }

  @Get('stats')
  async getKitchenStats() {
    return this.kitchenService.getKitchenStats();
  }
}