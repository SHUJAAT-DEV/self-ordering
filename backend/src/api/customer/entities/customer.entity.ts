import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("customers")
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ name: "name", type: "varchar", nullable: false })
  public name: string;

  @Column({ name: "contact", type: "varchar", nullable: true })
  public contact: string | null;

  @Column({ name: "email", type: "varchar", nullable: true })
  public email: string | null;

  @Column({ name: "address", type: "varchar", nullable: true })
  public address: string | null;

  @Column({
    default: 0,
    name: "voided",
  })
  voided: boolean;
}
