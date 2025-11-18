import { MigrationInterface, QueryRunner } from "typeorm";

export class DropCustomerDeviceTable1731750800000 implements MigrationInterface {
    name = 'DropCustomerDeviceTable1731750800000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraints first
        await queryRunner.query(`ALTER TABLE "yaazoru"."customer_devices" DROP CONSTRAINT "FK_454375e29732662c614fd239116"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."customer_devices" DROP CONSTRAINT "FK_71b7b5f24ed2f43dc53a4b24283"`);
        
        // Drop indexes
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_ae7c5852b32d9ef1b187ff343d"`);
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_454375e29732662c614fd23911"`);
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_71b7b5f24ed2f43dc53a4b2428"`);
        
        // Drop table
        await queryRunner.query(`DROP TABLE "yaazoru"."customer_devices"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Recreate table
        await queryRunner.query(`CREATE TABLE "yaazoru"."customer_devices" ("customerDevice_id" SERIAL NOT NULL, "customer_id" integer NOT NULL, "device_id" integer NOT NULL, "receivedAt" date NOT NULL, "planEndDate" date, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2d82e1e2abbf7601ed8489dfc5f" UNIQUE ("customer_id", "device_id"), CONSTRAINT "PK_ac6141477143fb93e3a575280cf" PRIMARY KEY ("customerDevice_id"))`);
        
        // Recreate indexes
        await queryRunner.query(`CREATE INDEX "IDX_71b7b5f24ed2f43dc53a4b2428" ON "yaazoru"."customer_devices" ("customer_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_454375e29732662c614fd23911" ON "yaazoru"."customer_devices" ("device_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ae7c5852b32d9ef1b187ff343d" ON "yaazoru"."customer_devices" ("created_at") `);
        
        // Recreate foreign keys
        await queryRunner.query(`ALTER TABLE "yaazoru"."customer_devices" ADD CONSTRAINT "FK_71b7b5f24ed2f43dc53a4b24283" FOREIGN KEY ("customer_id") REFERENCES "yaazoru"."customers"("customer_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."customer_devices" ADD CONSTRAINT "FK_454375e29732662c614fd239116" FOREIGN KEY ("device_id") REFERENCES "yaazoru"."devices"("device_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
