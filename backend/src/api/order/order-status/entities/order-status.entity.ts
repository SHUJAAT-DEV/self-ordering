import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("orderStatus")
export class OrderStatus extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ type: "varchar" })
  public name: string | null;
}
