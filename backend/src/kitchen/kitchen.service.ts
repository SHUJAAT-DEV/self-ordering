import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { OrderItem, OrderItemStatus } from '../orders/entities/order-item.entity';
import { OrderStatusHistory } from '../orders/entities/order-status-history.entity';
import { SseService } from '../sse/sse.service';

@Injectable()
export class KitchenService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(OrderStatusHistory)
    private statusHistoryRepository: Repository<OrderStatusHistory>,
    private sseService: SseService,
    private eventEmitter: EventEmitter2,
  ) {}

  // Get all orders for kitchen display
  async getKitchenOrders(): Promise<Order[]> {
    return this.ordersRepository.find({
      where: [
        { status: OrderStatus.CONFIRMED },
        { status: OrderStatus.PREPARING },
      ],
      relations: ['table', 'items', 'items.product'],
      order: { createdAt: 'ASC' },
    });
  }

  // Get orders by status for kitchen workflow
  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { status },
      relations: ['table', 'items', 'items.product'],
      order: { createdAt: 'ASC' },
    });
  }

  // Start preparing an order
  async startPreparingOrder(orderId: number, userId?: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['table', 'items'],
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status !== OrderStatus.CONFIRMED) {
      throw new Error('Order cannot be started - invalid status');
    }

    // Update order status
    order.status = OrderStatus.PREPARING;
    order.startedPreparingAt = new Date();
    if (userId) {
      order.preparedById = userId;
    }

    // Update all order items to preparing
    await this.orderItemsRepository.update(
      { orderId: orderId },
      { status: OrderItemStatus.PREPARING }
    );

    // Save status history
    const statusHistory = this.statusHistoryRepository.create({
      orderId: orderId,
      fromStatus: OrderStatus.CONFIRMED,
      toStatus: OrderStatus.PREPARING,
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
      status: OrderStatus.PREPARING,
      data: updatedOrder,
    });

    return updatedOrder;
  }

  // Mark order as ready
  async markOrderReady(orderId: number, userId?: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['table', 'items'],
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status !== OrderStatus.PREPARING) {
      throw new Error('Order is not being prepared');
    }

    // Update order status
    order.status = OrderStatus.READY;
    order.readyAt = new Date();

    // Update all order items to ready
    await this.orderItemsRepository.update(
      { orderId: orderId },
      { status: OrderItemStatus.READY }
    );

    // Save status history
    const statusHistory = this.statusHistoryRepository.create({
      orderId: orderId,
      fromStatus: OrderStatus.PREPARING,
      toStatus: OrderStatus.READY,
      changedAt: new Date(),
      changedById: userId,
    });
    await this.statusHistoryRepository.save(statusHistory);

    const updatedOrder = await this.ordersRepository.save(order);

    // Emit real-time event to notify counter and waiters
    this.eventEmitter.emit('order.status_changed', {
      type: 'order.status_changed',
      orderId: orderId,
      tableId: order.tableId,
      status: OrderStatus.READY,
      data: updatedOrder,
    });

    this.eventEmitter.emit('kitchen.order_ready', {
      type: 'kitchen.order_ready',
      orderId: orderId,
      orderNumber: order.orderNumber,
      data: updatedOrder,
    });

    return updatedOrder;
  }

  // Update individual order item status
  async updateOrderItemStatus(
    itemId: number,
    status: OrderItemStatus,
    userId?: number,
  ): Promise<OrderItem> {
    const orderItem = await this.orderItemsRepository.findOne({
      where: { id: itemId },
      relations: ['order', 'product'],
    });

    if (!orderItem) {
      throw new Error('Order item not found');
    }

    orderItem.status = status;
    const updatedItem = await this.orderItemsRepository.save(orderItem);

    // Check if all items are ready to update main order status
    const allItems = await this.orderItemsRepository.find({
      where: { orderId: orderItem.orderId },
    });

    const allItemsReady = allItems.every(item => item.status === OrderItemStatus.READY);
    
    if (allItemsReady && orderItem.order.status === OrderStatus.PREPARING) {
      await this.markOrderReady(orderItem.orderId, userId);
    }

    return updatedItem;
  }

  // Get kitchen statistics
  async getKitchenStats(): Promise<{
    pendingOrders: number;
    preparingOrders: number;
    readyOrders: number;
    averagePreparationTime: number;
  }> {
    const [pendingOrders, preparingOrders, readyOrders] = await Promise.all([
      this.ordersRepository.count({ where: { status: OrderStatus.CONFIRMED } }),
      this.ordersRepository.count({ where: { status: OrderStatus.PREPARING } }),
      this.ordersRepository.count({ where: { status: OrderStatus.READY } }),
    ]);

    // Calculate average preparation time from completed orders today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const completedOrders = await this.ordersRepository.find({
      where: {
        readyAt: new Date(today.getTime()),
        startedPreparingAt: new Date(today.getTime()),
      },
    });

    let averagePreparationTime = 0;
    if (completedOrders.length > 0) {
      const totalTime = completedOrders.reduce((sum, order) => {
        if (order.startedPreparingAt && order.readyAt) {
          const diff = order.readyAt.getTime() - order.startedPreparingAt.getTime();
          return sum + (diff / 1000 / 60); // minutes
        }
        return sum;
      }, 0);
      averagePreparationTime = totalTime / completedOrders.length;
    }

    return {
      pendingOrders,
      preparingOrders,
      readyOrders,
      averagePreparationTime: Math.round(averagePreparationTime),
    };
  }
}