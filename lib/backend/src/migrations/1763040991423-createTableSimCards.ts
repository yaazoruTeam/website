import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableSimCards1763040991423 implements MigrationInterface {
    name = 'CreateTableSimCards1763040991423'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "yaazoru"."sim_cards" ("simCard_id" SERIAL NOT NULL, "simNumber" character varying(50) NOT NULL, "customer_id" integer, "device_id" integer, "receivedAt" TIMESTAMP, "planEndDate" TIMESTAMP, "plan" character varying(50), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "yaazoru"."sim_cards_status_enum" NOT NULL DEFAULT 'active', CONSTRAINT "UQ_25f912613f7bbae2da3e70e6449" UNIQUE ("simNumber"), CONSTRAINT "UQ_48a88887996769fcc8489291ac5" UNIQUE ("device_id"), CONSTRAINT "REL_48a88887996769fcc8489291ac" UNIQUE ("device_id"), CONSTRAINT "PK_07fdb16ecc39e7eaec7989999b1" PRIMARY KEY ("simCard_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_25f912613f7bbae2da3e70e644" ON "yaazoru"."sim_cards" ("simNumber") `);
        await queryRunner.query(`CREATE INDEX "IDX_819f9cc9404feada73a9f9bd5f" ON "yaazoru"."sim_cards" ("customer_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_48a88887996769fcc8489291ac" ON "yaazoru"."sim_cards" ("device_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_5e4fc0157385bc3090cb1e823d" ON "yaazoru"."sim_cards" ("status") `);
        await queryRunner.query(`ALTER TABLE "yaazoru"."sim_cards" ADD CONSTRAINT "FK_819f9cc9404feada73a9f9bd5f4" FOREIGN KEY ("customer_id") REFERENCES "yaazoru"."customers"("customer_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."sim_cards" ADD CONSTRAINT "FK_48a88887996769fcc8489291ac5" FOREIGN KEY ("device_id") REFERENCES "yaazoru"."devices"("device_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "yaazoru"."sim_cards" DROP CONSTRAINT "FK_48a88887996769fcc8489291ac5"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."sim_cards" DROP CONSTRAINT "FK_819f9cc9404feada73a9f9bd5f4"`);
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_5e4fc0157385bc3090cb1e823d"`);
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_48a88887996769fcc8489291ac"`);
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_819f9cc9404feada73a9f9bd5f"`);
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_25f912613f7bbae2da3e70e644"`);
        await queryRunner.query(`DROP TABLE "yaazoru"."sim_cards"`);
    }

}
