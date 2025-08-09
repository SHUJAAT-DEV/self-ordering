import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

export enum OrderItemStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  READY = 'ready',
  SERVED = 'served',
  CANCELLED = 'cancelled'
}

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number; // Price at the time of ordering

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number; // unitPrice * quantity

  @Column({
    type: 'enum',
    enum: OrderItemStatus,
    default: OrderItemStatus.PENDING
  })
  status: OrderItemStatus;

  @Column({ type: 'text', nullable: true })
  notes: string; // Special instructions for this item

  @Column({ type: 'text', nullable: true })
  modifications: string; // e.g., "no onions", "extra cheese"

  @Column({ type: 'int', nullable: true })
  preparationTime: number; // estimated time for this item

  @ManyToOne(() => Order, order => order.items, { onDelete: 'CASCADE' })
  order: Order;

  @Column()
  orderId: number;

  @ManyToOne(() => Product, product => product.orderItems, { onDelete: 'CASCADE' })
  product: Product;

  @Column()
  productId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}