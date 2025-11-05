import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCustomerDeviceTable1730822400000 implements MigrationInterface {
    name = 'CreateCustomerDeviceTable1730822400000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "yaazoru"."customer_devices" ("customerDevice_id" SERIAL NOT NULL, "customer_id" integer NOT NULL, "device_id" integer NOT NULL, "receivedAt" date NOT NULL, "planEndDate" date, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_customer_device" UNIQUE ("customer_id", "device_id"), CONSTRAINT "PK_customerDevice_id" PRIMARY KEY ("customerDevice_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_customer_devices_customer_id" ON "yaazoru"."customer_devices" ("customer_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_customer_devices_device_id" ON "yaazoru"."customer_devices" ("device_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_customer_devices_created_at" ON "yaazoru"."customer_devices" ("created_at") `);
        await queryRunner.query(`ALTER TABLE "yaazoru"."customer_devices" ADD CONSTRAINT "FK_customer_devices_customer" FOREIGN KEY ("customer_id") REFERENCES "yaazoru"."customers"("customer_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."customer_devices" ADD CONSTRAINT "FK_customer_devices_device" FOREIGN KEY ("device_id") REFERENCES "yaazoru"."devices"("device_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "yaazoru"."customer_devices" DROP CONSTRAINT "FK_customer_devices_device"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."customer_devices" DROP CONSTRAINT "FK_customer_devices_customer"`);
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_customer_devices_created_at"`);
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_customer_devices_device_id"`);
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_customer_devices_customer_id"`);
        await queryRunner.query(`DROP TABLE "yaazoru"."customer_devices"`);
    }

}
