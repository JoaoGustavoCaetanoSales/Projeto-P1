import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateProductTables1787864300000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "product_categories",
      columns: [
        { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
        { name: "name", type: "varchar", length: "255" },
        { name: "createdAt", type: "timestamp", default: "CURRENT_TIMESTAMP" },
        { name: "updatedAt", type: "timestamp", default: "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" },
      ],
    }));

    await queryRunner.createTable(new Table({
      name: "product_situations",
      columns: [
        { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
        { name: "name", type: "varchar", length: "255" },
        { name: "createdAt", type: "timestamp", default: "CURRENT_TIMESTAMP" },
        { name: "updatedAt", type: "timestamp", default: "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" },
      ],
    }));

    await queryRunner.createTable(new Table({
      name: "products",
      columns: [
        { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
        { name: "name", type: "varchar", length: "255" },
        { name: "productSituationId", type: "int" },
        { name: "productCategoryId", type: "int" },
        { name: "createdAt", type: "timestamp", default: "CURRENT_TIMESTAMP" },
        { name: "updatedAt", type: "timestamp", default: "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" },
      ],
    }));

    await queryRunner.createForeignKeys("products", [
      new TableForeignKey({
        columnNames: ["productSituationId"],
        referencedColumnNames: ["id"],
        referencedTableName: "product_situations",
        onDelete: "CASCADE",
      }),
      new TableForeignKey({
        columnNames: ["productCategoryId"],
        referencedColumnNames: ["id"],
        referencedTableName: "product_categories",
        onDelete: "CASCADE",
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("products", true);
    await queryRunner.dropTable("product_situations");
    await queryRunner.dropTable("product_categories");
  }
}