import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Order } from "../../entities/order.entity";
import { Menue } from "@/api/menue/entities/menue.entity";
@Entity("orderMenue")
export class OrderMenue extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ name: "quantity", type: "int", nullable: true })
  public quantity: Number;

  @ManyToOne(() => Menue, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
  @JoinColumn({ name: "menue_id" })
  menueId: string;

  @ManyToOne(() => Order, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
  @JoinColumn({ name: "order_id" })
  orderId: string;
}
