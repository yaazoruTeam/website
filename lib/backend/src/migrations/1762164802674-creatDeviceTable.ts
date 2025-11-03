import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatDeviceTable1762164802674 implements MigrationInterface {
    name = 'CreatDeviceTable1762164802674'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "yaazoru"."devices_status_enum" AS ENUM('active', 'inactive', 'blocked', 'lock_in_imei')`);
        await queryRunner.query(`CREATE TABLE "yaazoru"."devices" ("device_id" SERIAL NOT NULL, "device_number" character varying(50) NOT NULL, "SIM_number" character varying(20) NOT NULL, "IMEI_1" character varying(20) NOT NULL, "model" character varying(100) NOT NULL, "status" "yaazoru"."devices_status_enum" NOT NULL DEFAULT 'active', "serialNumber" character varying(50) NOT NULL, "plan" character varying(50), "registrationDate" date NOT NULL, "purchaseDate" date, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ee360e060bb197c5adcfd4d9e39" UNIQUE ("SIM_number"), CONSTRAINT "UQ_ae7bd6294b663c9a941fb19265e" UNIQUE ("IMEI_1"), CONSTRAINT "UQ_190fa9fd55b3263df273e808cd3" UNIQUE ("serialNumber"), CONSTRAINT "UQ_190fa9fd55b3263df273e808cd3" UNIQUE ("serialNumber"), CONSTRAINT "UQ_ae7bd6294b663c9a941fb19265e" UNIQUE ("IMEI_1"), CONSTRAINT "UQ_ee360e060bb197c5adcfd4d9e39" UNIQUE ("SIM_number"), CONSTRAINT "PK_2667f40edb344d6f274a0d42b6f" PRIMARY KEY ("device_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4da2db785b80a7db15c7f8efb7" ON "yaazoru"."devices" ("device_number") `);
        await queryRunner.query(`CREATE INDEX "IDX_c37da3607f7214c3dda1803d09" ON "yaazoru"."devices" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_c8a996eaa1e44e03cea9e42aff" ON "yaazoru"."devices" ("created_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_c8a996eaa1e44e03cea9e42aff"`);
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_c37da3607f7214c3dda1803d09"`);
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_4da2db785b80a7db15c7f8efb7"`);
        await queryRunner.query(`DROP TABLE "yaazoru"."devices"`);
        await queryRunner.query(`DROP TYPE "yaazoru"."devices_status_enum"`);
    }

}
