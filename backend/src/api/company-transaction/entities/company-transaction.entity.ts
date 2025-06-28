import { Customer } from "@/api/customer/entities/customer.entity";
import { Expense } from "@/api/expense/entities/expense.entity";
import { User } from "@/api/user/entities/user.entity";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("companyTransactions")
export class CompanyTransaction extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ name: "transaction_type", type: "varchar", nullable: false })
  public transactionType: string;

  @Column({ name: "amount" })
  amount: number;

  @Column({ name: "balance" })
  balance: number;

  @CreateDateColumn({ name: "transaction_date", nullable: true })
  transactionDate: Date;

  @Column({ name: "description", type: "varchar", nullable: true })
  public description: string;

  @Column({ name: "particulars", type: "varchar", nullable: true })
  public particulars: string;

  @CreateDateColumn({ name: "created_date", nullable: true })
  createdDate: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: false, eager: true })
  @JoinColumn({ name: "user_id" })
  userId: string;

  @ManyToOne(() => Customer, (customer) => customer.id, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: "customer_id" })
  customerId: string | null;

  @ManyToOne(() => Expense, (expense) => expense.id, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: "expenseHead_id" })
  expenseHeadId: string | null;

  @Column({
    default: 0,
    name: "voided",
  })
  voided: boolean;
}
