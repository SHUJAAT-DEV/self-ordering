import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Table } from '../../tables/entities/table.entity';
import { User } from '../../users/entities/user.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { OrderItem } from './order-item.entity';
import { OrderStatusHistory } from './order-status-history.entity';

export enum OrderStatus {
  PENDING = 'pending',         // Order created, waiting to be confirmed
  CONFIRMED = 'confirmed',     // Order confirmed by waiter/system
  PREPARING = 'preparing',     // Order sent to kitchen
  READY = 'ready',            // Food is ready
  SERVED = 'served',          // Food served to customer
  PAID = 'paid',              // Payment completed
  CANCELLED = 'cancelled'      // Order cancelled
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  orderNumber: string; // human-readable order number like ORD-001

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  serviceCharge: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'text', nullable: true })
  notes: string; // Special instructions

  @Column({ type: 'text', nullable: true })
  customerNotes: string; // Customer-specific requests

  @Column({ type: 'int', nullable: true })
  estimatedPreparationTime: number; // in minutes

  @Column({ type: 'timestamp', nullable: true })
  confirmedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  startedPreparingAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  readyAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  servedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @ManyToOne(() => Table, table => table.orders, { onDelete: 'CASCADE' })
  table: Table;

  @Column()
  tableId: number;

  @ManyToOne(() => Customer, customer => customer.orders, { nullable: true })
  customer: Customer;

  @Column({ nullable: true })
  customerId: number;

  @ManyToOne(() => User, user => user.id, { nullable: true })
  waiter: User; // User who took the order

  @Column({ nullable: true })
  waiterId: number;

  @ManyToOne(() => User, user => user.id, { nullable: true })
  preparedBy: User; // Kitchen user who prepared the order

  @Column({ nullable: true })
  preparedById: number;

  @ManyToOne(() => User, user => user.id, { nullable: true })
  servedBy: User; // User who served the order

  @Column({ nullable: true })
  servedById: number;

  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
  items: OrderItem[];

  @OneToMany(() => OrderStatusHistory, history => history.order, { cascade: true })
  statusHistory: OrderStatusHistory[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}