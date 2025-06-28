import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("menueCategory")
export class MenueCategory extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ name: "name", type: "varchar", nullable: false })
  public name: string;

  @Column({
    default: 0,
    name: "is_available",
  })
  isAvailable: boolean;

  @Column({ name: "image", type: "varchar", nullable: true })
  public image: string;
}
