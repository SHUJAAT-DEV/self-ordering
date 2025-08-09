import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('daily')
  async getDailyReport(@Query('date') dateStr?: string) {
    const date = dateStr ? new Date(dateStr) : new Date();
    return this.reportsService.getDailySalesReport(date);
  }

  @Get('weekly')
  async getWeeklyReport(@Query('startDate') startDateStr: string) {
    const startDate = new Date(startDateStr);
    return this.reportsService.getWeeklySalesReport(startDate);
  }

  @Get('monthly')
  async getMonthlyReport(
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.reportsService.getMonthlySalesReport(year, month);
  }

  @Get('products')
  async getProductPerformanceReport(
    @Query('startDate') startDateStr: string,
    @Query('endDate') endDateStr: string,
  ) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    return this.reportsService.getProductPerformanceReport(startDate, endDate);
  }

  @Get('kitchen')
  async getKitchenPerformanceReport(@Query('date') dateStr?: string) {
    const date = dateStr ? new Date(dateStr) : new Date();
    return this.reportsService.getKitchenPerformanceReport(date);
  }
}