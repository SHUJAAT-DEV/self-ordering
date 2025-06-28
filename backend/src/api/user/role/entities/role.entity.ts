import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("role")
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ type: "varchar" })
  public name: string | null;
}
