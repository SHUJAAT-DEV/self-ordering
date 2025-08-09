import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { OrderStatusHistory } from '../orders/entities/order-status-history.entity';
import { Table, TableStatus } from '../tables/entities/table.entity';
import { SseService } from '../sse/sse.service';

export interface PaymentRequest {
  orderId: number;
  paymentMethod: 'cash' | 'card' | 'digital';
  amountPaid: number;
  userId?: number;
}

export interface BillSummary {
  order: Order;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  total: number;
  table: Table;
}

@Injectable()
export class CounterService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(OrderStatusHistory)
    private statusHistoryRepository: Repository<OrderStatusHistory>,
    @InjectRepository(Table)
    private tablesRepository: Repository<Table>,
    private sseService: SseService,
    private eventEmitter: EventEmitter2,
  ) {}

  // Get all ready orders for counter display
  async getReadyOrders(): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { status: OrderStatus.READY },
      relations: ['table', 'items', 'items.product'],
      order: { readyAt: 'ASC' },
    });
  }

  // Get orders by table number for counter lookup
  async getOrdersByTableNumber(tableNumber: string): Promise<Order[]> {
    const table = await this.tablesRepository.findOne({
      where: { name: tableNumber },
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    return this.ordersRepository.find({
      where: { 
        tableId: table.id,
        status: OrderStatus.READY 
      },
      relations: ['table', 'items', 'items.product'],
      order: { readyAt: 'ASC' },
    });
  }

  // Get detailed bill for an order
  async getBillDetails(orderId: number): Promise<BillSummary> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['table', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.READY && order.status !== OrderStatus.SERVED) {
      throw new BadRequestException('Order is not ready for billing');
    }

    return {
      order,
      items: order.items,
      subtotal: Number(order.subtotal),
      tax: Number(order.tax),
      serviceCharge: Number(order.serviceCharge),
      discount: Number(order.discount),
      total: Number(order.total),
      table: order.table,
    };
  }

  // Process payment and complete order
  async processPayment(paymentData: PaymentRequest): Promise<Order> {
    const { orderId, paymentMethod, amountPaid, userId } = paymentData;

    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['table', 'items'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.READY && order.status !== OrderStatus.SERVED) {
      throw new BadRequestException('Order is not ready for payment');
    }

    if (amountPaid < Number(order.total)) {
      throw new BadRequestException('Insufficient payment amount');
    }

    // Update order status
    const fromStatus = order.status;
    order.status = OrderStatus.PAID;
    order.paidAt = new Date();

    // Save status history
    const statusHistory = this.statusHistoryRepository.create({
      orderId: orderId,
      fromStatus: fromStatus,
      toStatus: OrderStatus.PAID,
      changedAt: new Date(),
      changedById: userId,
      notes: `Payment: ${paymentMethod}, Amount: ${amountPaid}`,
    });
    await this.statusHistoryRepository.save(statusHistory);

    const updatedOrder = await this.ordersRepository.save(order);

    // Update table status to available
    await this.tablesRepository.update(
      { id: order.tableId },
      { status: TableStatus.AVAILABLE }
    );

    // Emit real-time events
    this.eventEmitter.emit('order.status_changed', {
      type: 'order.status_changed',
      orderId: orderId,
      tableId: order.tableId,
      status: OrderStatus.PAID,
      data: updatedOrder,
    });

    this.eventEmitter.emit('table.status_changed', {
      tableId: order.tableId,
      status: TableStatus.AVAILABLE,
    });

    return updatedOrder;
  }

  // Mark order as served (before payment)
  async markOrderServed(orderId: number, userId?: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['table', 'items'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.READY) {
      throw new BadRequestException('Order is not ready to be served');
    }

    // Update order status
    order.status = OrderStatus.SERVED;
    order.servedAt = new Date();
    if (userId) {
      order.servedById = userId;
    }

    // Save status history
    const statusHistory = this.statusHistoryRepository.create({
      orderId: orderId,
      fromStatus: OrderStatus.READY,
      toStatus: OrderStatus.SERVED,
      changedAt: new Date(),
      changedById: userId,
    });
    await this.statusHistoryRepository.save(statusHistory);

    const updatedOrder = await this.ordersRepository.save(order);

    // Emit real-time event
    this.eventEmitter.emit('order.status_changed', {
      type: 'order.status_changed',
      orderId: orderId,
      tableId: order.tableId,
      status: OrderStatus.SERVED,
      data: updatedOrder,
    });

    return updatedOrder;
  }

  // Generate printable bill data
  async generateBillPrint(orderId: number): Promise<{
    billData: BillSummary;
    printFormat: string;
  }> {
    const billData = await this.getBillDetails(orderId);

    // Create a simple print format (you can enhance this with proper formatting)
    const printFormat = this.formatBillForPrint(billData);

    return {
      billData,
      printFormat,
    };
  }

  private formatBillForPrint(bill: BillSummary): string {
    const header = `
===========================================
           RESTAURANT NAME
        123 Restaurant Street
         City, State 12345
        Phone: (555) 123-4567
===========================================
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}
Order #: ${bill.order.orderNumber}
Table: ${bill.table.name}
-------------------------------------------
`;

    const items = bill.items.map(item => 
      `${item.product.name.padEnd(20)} x${item.quantity} ${Number(item.totalPrice).toFixed(2).padStart(8)}`
    ).join('\n');

    const footer = `
-------------------------------------------
Subtotal:${Number(bill.subtotal).toFixed(2).padStart(25)}
Tax:${Number(bill.tax).toFixed(2).padStart(30)}
Service:${Number(bill.serviceCharge).toFixed(2).padStart(29)}
Discount:${Number(bill.discount).toFixed(2).padStart(28)}
-------------------------------------------
TOTAL:${Number(bill.total).toFixed(2).padStart(28)}
===========================================
        Thank you for dining with us!
         Please come again!
===========================================
`;

    return header + items + footer;
  }

  // Get counter statistics
  async getCounterStats(): Promise<{
    readyOrders: number;
    servedOrders: number;
    completedOrdersToday: number;
    totalRevenueToday: number;
    averageOrderValue: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [readyOrders, servedOrders, completedOrders] = await Promise.all([
      this.ordersRepository.count({ where: { status: OrderStatus.READY } }),
      this.ordersRepository.count({ where: { status: OrderStatus.SERVED } }),
      this.ordersRepository.find({
        where: {
          status: OrderStatus.PAID,
          paidAt: new Date(today.getTime()),
        },
      }),
    ]);

    const totalRevenue = completedOrders.reduce((sum, order) => sum + Number(order.total), 0);
    const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

    return {
      readyOrders,
      servedOrders,
      completedOrdersToday: completedOrders.length,
      totalRevenueToday: totalRevenue,
      averageOrderValue,
    };
  }

  // Search orders by multiple criteria
  async searchOrders(searchCriteria: {
    tableNumber?: string;
    orderNumber?: string;
    status?: OrderStatus;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<Order[]> {
    const queryBuilder = this.ordersRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.table', 'table')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product');

    if (searchCriteria.tableNumber) {
      queryBuilder.andWhere('table.name = :tableName', { 
        tableName: searchCriteria.tableNumber 
      });
    }

    if (searchCriteria.orderNumber) {
      queryBuilder.andWhere('order.orderNumber = :orderNumber', { 
        orderNumber: searchCriteria.orderNumber 
      });
    }

    if (searchCriteria.status) {
      queryBuilder.andWhere('order.status = :status', { 
        status: searchCriteria.status 
      });
    }

    if (searchCriteria.dateFrom) {
      queryBuilder.andWhere('order.createdAt >= :dateFrom', { 
        dateFrom: searchCriteria.dateFrom 
      });
    }

    if (searchCriteria.dateTo) {
      queryBuilder.andWhere('order.createdAt <= :dateTo', { 
        dateTo: searchCriteria.dateTo 
      });
    }

    return queryBuilder.orderBy('order.createdAt', 'DESC').getMany();
  }
}