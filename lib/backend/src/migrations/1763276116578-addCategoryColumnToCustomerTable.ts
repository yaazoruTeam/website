import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategoryColumnToCustomerTable1763276116578 implements MigrationInterface {
    name = 'AddCategoryColumnToCustomerTable1763276116578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "yaazoru"."customers_category_enum" AS ENUM('main', 'sand', 'youtube', 'app', 'waze')`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."customers" ADD "category" "yaazoru"."customers_category_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "yaazoru"."customers" DROP COLUMN "category"`);
        await queryRunner.query(`DROP TYPE "yaazoru"."customers_category_enum"`);
    }

}
