import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateLengthOfCommentTable1762693188013 implements MigrationInterface {
    name = 'UpdateLengthOfCommentTable1762693188013'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_comments_entity_id"`);
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_comments_entity_type"`);
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_comments_created_at"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."comments" DROP COLUMN "file_name"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."comments" ADD "file_name" character varying(10)`);
        await queryRunner.query(`CREATE INDEX "IDX_27b6725d03ab49cab126157e99" ON "yaazoru"."comments" ("entity_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_74af724c665708598e61754bbb" ON "yaazoru"."comments" ("entity_type") `);
        await queryRunner.query(`CREATE INDEX "IDX_8e7c9a36c0ac867b543c6509aa" ON "yaazoru"."comments" ("created_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_8e7c9a36c0ac867b543c6509aa"`);
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_74af724c665708598e61754bbb"`);
        await queryRunner.query(`DROP INDEX "yaazoru"."IDX_27b6725d03ab49cab126157e99"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."comments" DROP COLUMN "file_name"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."comments" ADD "file_name" character varying(255)`);
        await queryRunner.query(`CREATE INDEX "IDX_comments_created_at" ON "yaazoru"."comments" ("created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_comments_entity_type" ON "yaazoru"."comments" ("entity_type") `);
        await queryRunner.query(`CREATE INDEX "IDX_comments_entity_id" ON "yaazoru"."comments" ("entity_id") `);
    }

}
