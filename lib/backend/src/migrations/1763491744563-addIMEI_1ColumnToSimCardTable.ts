import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIMEI1ColumnToSimCardTable1763491744563 implements MigrationInterface {
    name = 'AddIMEI1ColumnToSimCardTable1763491744563'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "yaazoru"."sim_cards" ADD "IMEI_1" character varying(20)`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."sim_cards" ADD CONSTRAINT "UQ_b5b7b9e71041ced653f6c81628e" UNIQUE ("IMEI_1")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "yaazoru"."sim_cards" DROP CONSTRAINT "UQ_b5b7b9e71041ced653f6c81628e"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."sim_cards" DROP COLUMN "IMEI_1"`);
    }

}
