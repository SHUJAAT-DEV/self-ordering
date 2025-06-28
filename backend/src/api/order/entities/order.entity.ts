import { Menue } from "@/api/menue/entities/menue.entity";
import { Table } from "@/api/table/entities/table.entity";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OrderStatus } from "../order-status/entities/order-status.entity";

@Entity("order")
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @CreateDateColumn({ name: "order_date", nullable: false })
  orderDate: Date;

  @Column({ name: "discount", type: "varchar", nullable: false })
  public discount: string;

  @Column({ name: "total", type: "varchar", nullable: false })
  public total: string;

  @Column({ name: "invoice_no", type: "varchar", nullable: false })
  public invoiceNumber: string;

  @ManyToOne(() => OrderStatus, (orderStatus) => orderStatus.id, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: "order_status_id" })
  orderStatusId: string;

  @ManyToOne(() => Table, (table) => table.id, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: "table_id" })
  tableId: string;
}
