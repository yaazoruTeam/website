import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCustemer1762678361767 implements MigrationInterface {
    name = 'CreateCustemer1762678361767'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "yaazoru"."customers_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "yaazoru"."customers" ("customer_id" SERIAL NOT NULL, "first_name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, "id_number" character varying(9), "phone_number" character varying(20) NOT NULL, "additional_phone" character varying(20), "email" character varying(40), "city" character varying(100), "address" character varying(255), "status" "yaazoru"."customers_status_enum" NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5bcd591f27d80d6b04af955eae0" UNIQUE ("id_number"), CONSTRAINT "UQ_46c5f573cb24bdc6e81b8ef2504" UNIQUE ("phone_number"), CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03" UNIQUE ("email"), CONSTRAINT "UQ_5bcd591f27d80d6b04af955eae0" UNIQUE ("id_number"), CONSTRAINT "UQ_46c5f573cb24bdc6e81b8ef2504" UNIQUE ("phone_number"), CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03" UNIQUE ("email"), CONSTRAINT "PK_6c444ce6637f2c1d71c3cf136c1" PRIMARY KEY ("customer_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1d497ab89fbba95db7a464ed57" ON "yaazoru"."customers" ("city") `);
        await queryRunner.query(`CREATE INDEX "IDX_589e5e6434f0e8628aa2ad33e1" ON "yaazoru"."customers" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_a8fcf679692db1c886e7f15d2b" ON "yaazoru"."customers" ("created_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_a8fcf679692db1c886e7f15d2b"`);
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_589e5e6434f0e8628aa2ad33e1"`);
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_1d497ab89fbba95db7a464ed57"`);
        await queryRunner.query(`DROP TABLE "yaazoru"."customers"`);
        await queryRunner.query(`DROP TYPE "yaazoru"."customers_status_enum"`);
    }

}
