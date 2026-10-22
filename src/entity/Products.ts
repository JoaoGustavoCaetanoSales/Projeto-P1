import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductCategory } from "./ProductCategory";
import { ProductSituation } from "./ProductSituation";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => ProductSituation, (situation) => situation.products, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productSituationId" })
  productSituation!: ProductSituation;

  @ManyToOne(() => ProductCategory, (category) => category.products, { onDelete: "CASCADE" })
  @JoinColumn({ name: "productCategoryId" })
  productCategory!: ProductCategory;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}