import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateLengthOfCommentTable1762693895172 implements MigrationInterface {
    name = 'UpdateLengthOfCommentTable1762693895172'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "yaazoru"."comments" DROP COLUMN "file_name"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."comments" ADD "file_name" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."comments" DROP COLUMN "file_type"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."comments" ADD "file_type" character varying(10)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "yaazoru"."comments" DROP COLUMN "file_type"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."comments" ADD "file_type" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."comments" DROP COLUMN "file_name"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."comments" ADD "file_name" character varying(10)`);
    }

}
