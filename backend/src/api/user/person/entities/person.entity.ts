import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("person")
export class Person extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ name: "first_name", type: "varchar", nullable: false })
  public firstName: string;

  @Column({ name: "last_name", type: "varchar", nullable: true })
  public lastName: string;

  @Column({ name: "contact", type: "varchar", nullable: true })
  public contact: string;

  @Column({ name: "email", type: "varchar", nullable: true })
  public email: string;

  @Column({ name: "address", type: "varchar", nullable: true })
  public address: string;
}
