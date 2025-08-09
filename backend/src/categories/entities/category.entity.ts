import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Subcategory } from './subcategory.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image: string; // file path or URL

  @Column({ type: 'varchar', length: 100, nullable: true })
  imageFileName: string; // original filename for offline caching

  @Column({ type: 'varchar', length: 50, nullable: true })
  imageMimeType: string; // for proper offline handling

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'varchar', length: 7, nullable: true })
  colorCode: string; // hex color for UI theming

  @OneToMany(() => Subcategory, subcategory => subcategory.category, { cascade: true })
  subcategories: Subcategory[];

  @OneToMany(() => Product, product => product.category)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}