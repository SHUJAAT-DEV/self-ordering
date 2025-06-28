import { User } from "@/api/user/entities/user.entity";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("table")
export class Table extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ name: "table_number", type: "varchar", nullable: false })
  public tableNumber: string;

  @Column({ name: "capacity", type: "int", nullable: true })
  public capacity: Number;

  @Column({
    default: 0,
    name: "is_reserve",
  })
  isReserve: boolean;

  @ManyToOne(() => User, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
  @JoinColumn({ name: "user_Id" })
  userId: string;
}
