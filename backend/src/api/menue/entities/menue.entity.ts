import { MenueCategory } from "@/api/menue-category/entities/menue-category.entity";
import { User } from "@/api/user/entities/user.entity";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("menue")
export class Menue extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ name: "name", type: "varchar", nullable: false })
  public name: string;

  @Column({ name: "price", type: "varchar", nullable: false })
  public price: string;

  @Column({ name: "discount", type: "varchar", nullable: true })
  public discount: string;

  @Column({ name: "image", type: "varchar", nullable: true })
  public image: string;

  @Column({
    default: 0,
    name: "is_available",
  })
  isAvailable: boolean;

  @ManyToOne(() => User, { onDelete: "RESTRICT", onUpdate: "CASCADE" })
  @JoinColumn({ name: "user_Id" })
  userId: string;

  @ManyToOne(() => MenueCategory, (menuCategory) => menuCategory.id, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: "menueCategory_id" })
  menueCategoryId: string;
}
