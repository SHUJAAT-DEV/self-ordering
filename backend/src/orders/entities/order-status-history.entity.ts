import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { User } from '../../users/entities/user.entity';

@Entity('order_status_history')
export class OrderStatusHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: true
  })
  fromStatus: string | null;

  @Column({
    type: 'varchar'
  })
  toStatus: string;

  @Column({ type: 'text', nullable: true })
  notes: string; // Reason for status change

  @Column({ type: 'timestamp' })
  changedAt: Date;

  @ManyToOne(() => Order, order => order.statusHistory, { onDelete: 'CASCADE' })
  order: Order;

  @Column()
  orderId: number;

  @ManyToOne(() => User, user => user.id, { nullable: true })
  changedBy: User; // User who changed the status

  @Column({ nullable: true })
  changedById: number;

  @CreateDateColumn()
  createdAt: Date;
}