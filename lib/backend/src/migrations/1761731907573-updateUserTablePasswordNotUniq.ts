import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTablePasswordNotUniq1761731907573 implements MigrationInterface {
    name = 'UpdateUserTablePasswordNotUniq1761731907573'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "yaazoru"."users" DROP CONSTRAINT "UQ_450a05c0c4de5b75ac8d34835b9"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "yaazoru"."users" ADD CONSTRAINT "UQ_450a05c0c4de5b75ac8d34835b9" UNIQUE ("password")`);
    }

}
