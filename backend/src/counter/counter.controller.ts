import { Controller, Get, Post, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { CounterService, PaymentRequest } from './counter.service';
import { OrderStatus } from '../orders/entities/order.entity';

@Controller('counter')
export class CounterController {
  constructor(private counterService: CounterService) {}

  @Get('orders/ready')
  async getReadyOrders() {
    return this.counterService.getReadyOrders();
  }

  @Get('orders/table/:tableNumber')
  async getOrdersByTableNumber(@Param('tableNumber') tableNumber: string) {
    return this.counterService.getOrdersByTableNumber(tableNumber);
  }

  @Get('orders/:id/bill')
  async getBillDetails(@Param('id', ParseIntPipe) orderId: number) {
    return this.counterService.getBillDetails(orderId);
  }

  @Post('orders/:id/serve')
  async markOrderServed(
    @Param('id', ParseIntPipe) orderId: number,
    @Body('userId') userId?: number,
  ) {
    return this.counterService.markOrderServed(orderId, userId);
  }

  @Post('orders/:id/payment')
  async processPayment(
    @Param('id', ParseIntPipe) orderId: number,
    @Body() paymentData: Omit<PaymentRequest, 'orderId'>,
  ) {
    return this.counterService.processPayment({
      orderId,
      ...paymentData,
    });
  }

  @Get('orders/:id/print')
  async generateBillPrint(@Param('id', ParseIntPipe) orderId: number) {
    return this.counterService.generateBillPrint(orderId);
  }

  @Get('stats')
  async getCounterStats() {
    return this.counterService.getCounterStats();
  }

  @Get('orders/search')
  async searchOrders(
    @Query('tableNumber') tableNumber?: string,
    @Query('orderNumber') orderNumber?: string,
    @Query('status') status?: OrderStatus,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    const searchCriteria: any = {};
    
    if (tableNumber) searchCriteria.tableNumber = tableNumber;
    if (orderNumber) searchCriteria.orderNumber = orderNumber;
    if (status) searchCriteria.status = status;
    if (dateFrom) searchCriteria.dateFrom = new Date(dateFrom);
    if (dateTo) searchCriteria.dateTo = new Date(dateTo);

    return this.counterService.searchOrders(searchCriteria);
  }
}