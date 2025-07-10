import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tables')
export class Table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'int' })
  seats: number;

  @Column({ type: 'text', default: 'available' })
  status: string; // available, occupied, cleaning
} 