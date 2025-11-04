import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserTableNullAble1762252949172 implements MigrationInterface {
    name = 'UpdateUserTableNullAble1762252949172'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "yaazoru"."users" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."users" ALTER COLUMN "password" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."users" ALTER COLUMN "user_name" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "yaazoru"."users" ALTER COLUMN "user_name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."users" ALTER COLUMN "password" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."users" ALTER COLUMN "email" SET NOT NULL`);
    }

}
