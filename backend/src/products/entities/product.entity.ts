import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Subcategory } from '../../categories/entities/subcategory.entity';
import { OrderItem } from '../../orders/entities/order-item.entity';

export enum ProductStatus {
  AVAILABLE = 'available',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued'
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  shortDescription: string; // for mobile display

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  originalPrice: number; // for discounts/offers

  @Column({ type: 'varchar', length: 500, nullable: true })
  image: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  imageFileName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  imageMimeType: string;

  @Column({ type: 'json', nullable: true })
  gallery: string[]; // array of image paths for multiple images

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.AVAILABLE
  })
  status: ProductStatus;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'int', nullable: true })
  preparationTime: number; // in minutes

  @Column({ type: 'int', default: 0 })
  calories: number;

  @Column({ type: 'boolean', default: false })
  isVegetarian: boolean;

  @Column({ type: 'boolean', default: false })
  isVegan: boolean;

  @Column({ type: 'boolean', default: false })
  isGlutenFree: boolean;

  @Column({ type: 'boolean', default: false })
  isSpicy: boolean;

  @Column({ type: 'json', nullable: true })
  allergens: string[]; // array of allergen names

  @Column({ type: 'json', nullable: true })
  ingredients: string[]; // array of ingredient names

  @Column({ type: 'text', nullable: true })
  nutritionInfo: string; // JSON string of nutrition data

  @Column({ type: 'int', default: 0 })
  stock: number; // for inventory management

  @Column({ type: 'int', nullable: true })
  minimumStock: number; // alert threshold

  @ManyToOne(() => Category, category => category.products, { onDelete: 'CASCADE' })
  category: Category;

  @Column()
  categoryId: number;

  @ManyToOne(() => Subcategory, subcategory => subcategory.products, { nullable: true, onDelete: 'SET NULL' })
  subcategory: Subcategory;

  @Column({ nullable: true })
  subcategoryId: number;

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}