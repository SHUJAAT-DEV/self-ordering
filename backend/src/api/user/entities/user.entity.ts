import { Exclude } from "class-transformer";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Person } from "../person/entities/person.entity";
import { Role } from "../role/entities/role.entity";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ name: "user_name", type: "varchar", nullable: false })
  public username: string;

  @Exclude()
  @Column({ name: "password", type: "varchar" })
  public password: string;

  @Column({ name: "email", type: "varchar", nullable: true })
  public email: string;

  @Column({ name: "contact", type: "varchar", nullable: true })
  public contact: string;

  @CreateDateColumn({ name: "created_date", nullable: true })
  createdDate: Date;

  @Column({
    default: 0,
    name: "voided",
  })
  voided: boolean;

  @CreateDateColumn({ name: "voided_date", nullable: true })
  voidedDate: Date;

  @CreateDateColumn({ name: "last_login_at", nullable: true })
  lastLoginAt: Date;

  @ManyToOne(() => Person, (person) => person.id, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: "person_id" })
  personId: string;

  @ManyToOne(() => Role, (role) => role.id, {
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: "role_id" })
  roleId: string;
}
