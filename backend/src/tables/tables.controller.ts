import { Controller, Get, Post, Param, Body, ParseIntPipe } from '@nestjs/common';
import { TablesService, CreateOrderDto } from './tables.service';

@Controller('tables')
export class TablesController {
  constructor(private tablesService: TablesService) {}

  @Get()
  async getAllTables() {
    return this.tablesService.getAllTables();
  }

  @Get(':id')
  async getTableById(@Param('id', ParseIntPipe) id: number) {
    return this.tablesService.getTableById(id);
  }

  @Post(':id/orders')
  async createOrder(
    @Param('id', ParseIntPipe) tableId: number,
    @Body() createOrderDto: Omit<CreateOrderDto, 'tableId'>,
  ) {
    return this.tablesService.createOrder({
      tableId,
      ...createOrderDto,
    });
  }

  @Get(':id/current-order')
  async getCurrentOrder(@Param('id', ParseIntPipe) tableId: number) {
    return this.tablesService.getCurrentOrder(tableId);
  }
}
