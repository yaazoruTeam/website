import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSimCardTable1762932725515 implements MigrationInterface {
    name = 'CreateSimCardTable1762932725515'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "yaazoru"."sim_cards" ("simCard_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "simNumber" character varying(50) NOT NULL, "user_id" integer NOT NULL, "device_id" integer NOT NULL, "receivedAt" TIMESTAMP NOT NULL, "planEndDate" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_25f912613f7bbae2da3e70e6449" UNIQUE ("simNumber"), CONSTRAINT "UQ_48a88887996769fcc8489291ac5" UNIQUE ("device_id"), CONSTRAINT "REL_48a88887996769fcc8489291ac" UNIQUE ("device_id"), CONSTRAINT "PK_07fdb16ecc39e7eaec7989999b1" PRIMARY KEY ("simCard_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_25f912613f7bbae2da3e70e644" ON "yaazoru"."sim_cards" ("simNumber") `);
        await queryRunner.query(`CREATE INDEX "IDX_5ed828eda5e84c1d3ab5ca75bb" ON "yaazoru"."sim_cards" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_48a88887996769fcc8489291ac" ON "yaazoru"."sim_cards" ("device_id") `);
        await queryRunner.query(`ALTER TABLE "yaazoru"."devices" DROP CONSTRAINT "UQ_ee360e060bb197c5adcfd4d9e39"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."devices" DROP COLUMN "SIM_number"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."sim_cards" ADD CONSTRAINT "FK_5ed828eda5e84c1d3ab5ca75bb1" FOREIGN KEY ("user_id") REFERENCES "yaazoru"."users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."sim_cards" ADD CONSTRAINT "FK_48a88887996769fcc8489291ac5" FOREIGN KEY ("device_id") REFERENCES "yaazoru"."devices"("device_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "yaazoru"."sim_cards" DROP CONSTRAINT "FK_48a88887996769fcc8489291ac5"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."sim_cards" DROP CONSTRAINT "FK_5ed828eda5e84c1d3ab5ca75bb1"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."devices" ADD "SIM_number" character varying(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."devices" ADD CONSTRAINT "UQ_ee360e060bb197c5adcfd4d9e39" UNIQUE ("SIM_number")`);
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_48a88887996769fcc8489291ac"`);
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_5ed828eda5e84c1d3ab5ca75bb"`);
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_25f912613f7bbae2da3e70e644"`);
        await queryRunner.query(`DROP TABLE "yaazoru"."sim_cards"`);
    }

}
