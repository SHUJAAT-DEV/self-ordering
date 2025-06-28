import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Customer } from "../../entities/customer.entity";

@Entity("customerDocuments")
export class CustomerDocument extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ name: "document_type", type: "varchar", nullable: false })
  public documentType: string | null;

  @Column({ name: "image_path", type: "varchar", nullable: true })
  public imagePath: string | null;

  @Column({
    default: 0,
    name: "voided",
  })
  voided: boolean;

  @CreateDateColumn({ name: "voided_date", nullable: true })
  voidedDate: Date;

  @ManyToOne(() => Customer, (customer) => customer.id, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: "customer_id" })
  customerId: string | null;
}
