import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("expenses")
export class Expense extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ name: "name", type: "varchar", nullable: false })
  public name: string;
}
