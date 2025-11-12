import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableSimCard1762939165745 implements MigrationInterface {
    name = 'UpdateTableSimCard1762939165745'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "yaazoru"."sim_cards" DROP CONSTRAINT "FK_5ed828eda5e84c1d3ab5ca75bb1"`);
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_5ed828eda5e84c1d3ab5ca75bb"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."sim_cards" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."sim_cards" ADD "customer_id" integer`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."sim_cards" DROP CONSTRAINT "FK_48a88887996769fcc8489291ac5"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."sim_cards" ALTER COLUMN "device_id" DROP NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_819f9cc9404feada73a9f9bd5f" ON "yaazoru"."sim_cards" ("customer_id") `);
        await queryRunner.query(`ALTER TABLE "yaazoru"."sim_cards" ADD CONSTRAINT "FK_819f9cc9404feada73a9f9bd5f4" FOREIGN KEY ("customer_id") REFERENCES "yaazoru"."customers"("customer_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."sim_cards" ADD CONSTRAINT "FK_48a88887996769fcc8489291ac5" FOREIGN KEY ("device_id") REFERENCES "yaazoru"."devices"("device_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "yaazoru"."sim_cards" DROP CONSTRAINT "FK_48a88887996769fcc8489291ac5"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."sim_cards" DROP CONSTRAINT "FK_819f9cc9404feada73a9f9bd5f4"`);
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_819f9cc9404feada73a9f9bd5f"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."sim_cards" ALTER COLUMN "device_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."sim_cards" ADD CONSTRAINT "FK_48a88887996769fcc8489291ac5" FOREIGN KEY ("device_id") REFERENCES "yaazoru"."devices"("device_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."sim_cards" DROP COLUMN "customer_id"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."sim_cards" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_5ed828eda5e84c1d3ab5ca75bb" ON "yaazoru"."sim_cards" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "yaazoru"."sim_cards" ADD CONSTRAINT "FK_5ed828eda5e84c1d3ab5ca75bb1" FOREIGN KEY ("user_id") REFERENCES "yaazoru"."users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
