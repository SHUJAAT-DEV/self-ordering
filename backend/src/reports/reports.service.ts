import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { Table } from '../tables/entities/table.entity';

export interface DailySalesReport {
  date: string;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topSellingItems: Array<{
    productId: number;
    productName: string;
    quantitySold: number;
    revenue: number;
  }>;
  hourlyBreakdown: Array<{
    hour: number;
    orders: number;
    revenue: number;
  }>;
  tableUtilization: Array<{
    tableId: number;
    tableName: string;
    ordersServed: number;
    revenue: number;
    utilizationRate: number;
  }>;
  paymentMethods: {
    cash: number;
    card: number;
    digital: number;
  };
}

export interface WeeklySalesReport {
  weekStart: string;
  weekEnd: string;
  dailyReports: DailySalesReport[];
  weeklyTotals: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  };
}

export interface MonthlySalesReport {
  month: string;
  year: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topSellingItems: Array<{
    productId: number;
    productName: string;
    quantitySold: number;
    revenue: number;
  }>;
  dailyAverages: {
    ordersPerDay: number;
    revenuePerDay: number;
  };
}

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Table)
    private tablesRepository: Repository<Table>,
  ) {}

  async getDailySalesReport(date: Date): Promise<DailySalesReport> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all orders for the day
    const orders = await this.ordersRepository.find({
      where: {
        createdAt: Between(startOfDay, endOfDay),
      },
      relations: ['table', 'items', 'items.product'],
    });

    const completedOrders = orders.filter(order => order.status === OrderStatus.PAID);
    const cancelledOrders = orders.filter(order => order.status === OrderStatus.CANCELLED);

    const totalRevenue = completedOrders.reduce((sum, order) => sum + Number(order.total), 0);
    const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

    // Top selling items
    const itemSales = new Map<number, { productId: number; productName: string; quantitySold: number; revenue: number }>();
    
    completedOrders.forEach(order => {
      order.items.forEach(item => {
        const existing = itemSales.get(item.productId) || {
          productId: item.productId,
          productName: item.product.name,
          quantitySold: 0,
          revenue: 0,
        };
        
        existing.quantitySold += item.quantity;
        existing.revenue += Number(item.totalPrice);
        itemSales.set(item.productId, existing);
      });
    });

    const topSellingItems = Array.from(itemSales.values())
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 10);

    // Hourly breakdown
    const hourlyBreakdown = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      orders: 0,
      revenue: 0,
    }));

    completedOrders.forEach(order => {
      const hour = order.createdAt.getHours();
      hourlyBreakdown[hour].orders += 1;
      hourlyBreakdown[hour].revenue += Number(order.total);
    });

    // Table utilization
    const tables = await this.tablesRepository.find();
    const tableUtilization = tables.map(table => {
      const tableOrders = completedOrders.filter(order => order.tableId === table.id);
      const revenue = tableOrders.reduce((sum, order) => sum + Number(order.total), 0);
      
      return {
        tableId: table.id,
        tableName: table.name,
        ordersServed: tableOrders.length,
        revenue,
        utilizationRate: (tableOrders.length / Math.max(completedOrders.length, 1)) * 100,
      };
    });

    // Payment methods (mock data - would need to track payment methods in orders)
    const paymentMethods = {
      cash: Math.floor(completedOrders.length * 0.4),
      card: Math.floor(completedOrders.length * 0.45),
      digital: Math.floor(completedOrders.length * 0.15),
    };

    return {
      date: date.toISOString().split('T')[0],
      totalOrders: orders.length,
      completedOrders: completedOrders.length,
      cancelledOrders: cancelledOrders.length,
      totalRevenue,
      averageOrderValue,
      topSellingItems,
      hourlyBreakdown,
      tableUtilization,
      paymentMethods,
    };
  }

  async getWeeklySalesReport(startDate: Date): Promise<WeeklySalesReport> {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    const dailyReports: DailySalesReport[] = [];
    const currentDate = new Date(startDate);

    // Generate daily reports for each day of the week
    while (currentDate <= endDate) {
      const dailyReport = await this.getDailySalesReport(new Date(currentDate));
      dailyReports.push(dailyReport);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const weeklyTotals = dailyReports.reduce(
      (totals, daily) => ({
        totalOrders: totals.totalOrders + daily.completedOrders,
        totalRevenue: totals.totalRevenue + daily.totalRevenue,
        averageOrderValue: 0, // Will calculate after
      }),
      { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 }
    );

    weeklyTotals.averageOrderValue = 
      weeklyTotals.totalOrders > 0 ? weeklyTotals.totalRevenue / weeklyTotals.totalOrders : 0;

    return {
      weekStart: startDate.toISOString().split('T')[0],
      weekEnd: endDate.toISOString().split('T')[0],
      dailyReports,
      weeklyTotals,
    };
  }

  async getMonthlySalesReport(year: number, month: number): Promise<MonthlySalesReport> {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const orders = await this.ordersRepository.find({
      where: {
        createdAt: Between(startOfMonth, endOfMonth),
        status: OrderStatus.PAID,
      },
      relations: ['items', 'items.product'],
    });

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    // Top selling items for the month
    const itemSales = new Map<number, { productId: number; productName: string; quantitySold: number; revenue: number }>();
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const existing = itemSales.get(item.productId) || {
          productId: item.productId,
          productName: item.product.name,
          quantitySold: 0,
          revenue: 0,
        };
        
        existing.quantitySold += item.quantity;
        existing.revenue += Number(item.totalPrice);
        itemSales.set(item.productId, existing);
      });
    });

    const topSellingItems = Array.from(itemSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 15);

    const daysInMonth = endOfMonth.getDate();
    const dailyAverages = {
      ordersPerDay: orders.length / daysInMonth,
      revenuePerDay: totalRevenue / daysInMonth,
    };

    return {
      month: startOfMonth.toLocaleDateString('en-US', { month: 'long' }),
      year,
      totalOrders: orders.length,
      totalRevenue,
      averageOrderValue,
      topSellingItems,
      dailyAverages,
    };
  }

  async getProductPerformanceReport(startDate: Date, endDate: Date) {
    const orderItems = await this.orderItemsRepository
      .createQueryBuilder('orderItem')
      .leftJoinAndSelect('orderItem.product', 'product')
      .leftJoinAndSelect('orderItem.order', 'order')
      .where('order.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('order.status = :status', { status: OrderStatus.PAID })
      .getMany();

    const productStats = new Map();

    orderItems.forEach(item => {
      const productId = item.productId;
      const existing = productStats.get(productId) || {
        productId,
        productName: item.product.name,
        category: item.product.category?.name || 'Unknown',
        totalQuantity: 0,
        totalRevenue: 0,
        averagePrice: 0,
        orderCount: 0,
      };

      existing.totalQuantity += item.quantity;
      existing.totalRevenue += Number(item.totalPrice);
      existing.orderCount += 1;
      existing.averagePrice = existing.totalRevenue / existing.totalQuantity;

      productStats.set(productId, existing);
    });

    return Array.from(productStats.values())
      .sort((a, b) => b.totalRevenue - a.totalRevenue);
  }

  async getKitchenPerformanceReport(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await this.ordersRepository.find({
      where: {
        createdAt: Between(startOfDay, endOfDay),
      },
    });

    const completedOrders = orders.filter(order => 
      order.startedPreparingAt && order.readyAt && order.status === OrderStatus.PAID
    );

    const preparationTimes = completedOrders.map(order => {
      const start = order.startedPreparingAt!.getTime();
      const end = order.readyAt!.getTime();
      return (end - start) / 1000 / 60; // minutes
    });

    const averagePreparationTime = preparationTimes.length > 0 
      ? preparationTimes.reduce((sum, time) => sum + time, 0) / preparationTimes.length 
      : 0;

    const maxPreparationTime = preparationTimes.length > 0 
      ? Math.max(...preparationTimes) 
      : 0;

    const minPreparationTime = preparationTimes.length > 0 
      ? Math.min(...preparationTimes) 
      : 0;

    return {
      date: date.toISOString().split('T')[0],
      totalOrdersProcessed: completedOrders.length,
      averagePreparationTime: Math.round(averagePreparationTime),
      maxPreparationTime: Math.round(maxPreparationTime),
      minPreparationTime: Math.round(minPreparationTime),
      onTimeDeliveryRate: 85, // Mock percentage - would calculate based on estimated vs actual times
    };
  }
}