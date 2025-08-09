import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Table, TableStatus } from './entities/table.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { OrderStatusHistory } from '../orders/entities/order-status-history.entity';
import { Product } from '../products/entities/product.entity';
import { SseService } from '../sse/sse.service';

export interface CreateOrderDto {
  tableId: number;
  items: {
    productId: number;
    quantity: number;
    notes?: string;
    modifications?: string;
  }[];
  notes?: string;
  customerNotes?: string;
  waiterId?: number;
}

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private tablesRepository: Repository<Table>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(OrderStatusHistory)
    private statusHistoryRepository: Repository<OrderStatusHistory>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private sseService: SseService,
    private eventEmitter: EventEmitter2,
  ) {}

  // Get all tables with their current status
  async getAllTables(): Promise<Table[]> {
    try{
     return await this.tablesRepository.find({
        relations: ['orders'],
        order: { name: 'ASC' },
      });
    }catch(error){
      console.error("called tables error:",error.message);
      return []; // Return empty array on error instead of undefined
    }
  }

  // Get table by ID with current orders
  async getTableById(id: number): Promise<Table> {
    const table = await this.tablesRepository.findOne({
      where: { id },
      relations: ['orders', 'orders.items', 'orders.items.product'],
    });

    if (!table) {
      throw new NotFoundException('Table not found');
    }

    return table;
  }

  // Create new order for a table
  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { tableId, items, notes, customerNotes, waiterId } = createOrderDto;

    // Verify table exists
    const table = await this.tablesRepository.findOne({ where: { id: tableId } });
    if (!table) {
      throw new NotFoundException('Table not found');
    }

    // Generate order number
    const orderCount = await this.ordersRepository.count();
    const orderNumber = `ORD-${String(orderCount + 1).padStart(4, '0')}`;

    // Calculate totals (simplified for now)
    let subtotal = 20; // Mock calculation
    const tax = subtotal * 0.1;
    const serviceCharge = subtotal * 0.05;
    const total = subtotal + tax + serviceCharge;

    // Create order
    const order = this.ordersRepository.create({
      orderNumber,
      tableId,
      waiterId,
      subtotal,
      tax,
      serviceCharge,
      total,
      notes,
      customerNotes,
      estimatedPreparationTime: 20,
    });

    const savedOrder = await this.ordersRepository.save(order);

    // Update table status
    await this.tablesRepository.update(tableId, { status: TableStatus.OCCUPIED });

    // Emit event
    this.eventEmitter.emit('order.created', {
      type: 'order.created',
      orderId: savedOrder.id,
      tableId: tableId,
      data: savedOrder,
    });

    return savedOrder;
  }

  // Get current order for a table
  async getCurrentOrder(tableId: number): Promise<Order | null> {
    return this.ordersRepository.findOne({
      where: {
        tableId,
        status: OrderStatus.PENDING as any,
      },
      relations: ['table', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }
}
