import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCommentTable1762262016414 implements MigrationInterface {
    name = 'CreateCommentTable1762262016414'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "yaazoru"."comments_entity_type_enum" AS ENUM('customer', 'device', 'branch')`);
        await queryRunner.query(`CREATE TABLE "yaazoru"."comments" ("comment_id" SERIAL NOT NULL, "entity_id" integer NOT NULL, "entity_type" "yaazoru"."comments_entity_type_enum" NOT NULL, "content" text NOT NULL, "file_url" character varying(500), "file_name" character varying(255), "file_type" character varying(100), "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_comment_id" PRIMARY KEY ("comment_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_comments_entity_id" ON "yaazoru"."comments" ("entity_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_comments_entity_type" ON "yaazoru"."comments" ("entity_type") `);
        await queryRunner.query(`CREATE INDEX "IDX_comments_created_at" ON "yaazoru"."comments" ("created_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_comments_created_at"`);
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_comments_entity_type"`);
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_comments_entity_id"`);
        await queryRunner.query(`DROP TABLE "yaazoru"."comments"`);
        await queryRunner.query(`DROP TYPE "yaazoru"."comments_entity_type_enum"`);
    }

}
