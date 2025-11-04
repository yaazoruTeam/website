import { MigrationInterface, QueryRunner } from "typeorm";

export class IdNumberInUserTableNullAble1762247303531 implements MigrationInterface {
    name = 'IdNumberInUserTableNullAble1762247303531'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "yaazoru"."idx_customers_id_number"`);
        await queryRunner.query(`DROP INDEX "yaazoru"."idx_customers_created_at"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."users" ALTER COLUMN "id_number" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."users" ALTER COLUMN "city" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."users" ALTER COLUMN "address" DROP NOT NULL`);
        await queryRunner.query(`ALTER TYPE "yaazoru"."users_role_enum" RENAME TO "users_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "yaazoru"."users_role_enum" AS ENUM('admin', 'branch')`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."users" ALTER COLUMN "role" TYPE "yaazoru"."users_role_enum" USING "role"::"text"::"yaazoru"."users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."users" ALTER COLUMN "role" SET DEFAULT 'branch'`);
        await queryRunner.query(`DROP TYPE "yaazoru"."users_role_enum_old"`);
        await queryRunner.query(`ALTER TYPE "yaazoru"."customer_status" RENAME TO "customer_status_old"`);
        await queryRunner.query(`CREATE TYPE "yaazoru"."customers_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."customers" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."customers" ALTER COLUMN "status" TYPE "yaazoru"."customers_status_enum" USING "status"::"text"::"yaazoru"."customers_status_enum"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."customers" ALTER COLUMN "status" SET DEFAULT 'active'`);
        await queryRunner.query(`DROP TYPE "yaazoru"."customer_status_old"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."customers" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."customers" ALTER COLUMN "updated_at" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "yaazoru"."customers" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."customers" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`CREATE TYPE "yaazoru"."customer_status_old" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."customers" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."customers" ALTER COLUMN "status" TYPE "yaazoru"."customer_status_old" USING "status"::"text"::"yaazoru"."customer_status_old"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."customers" ALTER COLUMN "status" SET DEFAULT 'active'`);
        await queryRunner.query(`DROP TYPE "yaazoru"."customers_status_enum"`);
        await queryRunner.query(`ALTER TYPE "yaazoru"."customer_status_old" RENAME TO "customer_status"`);
        await queryRunner.query(`CREATE TYPE "yaazoru"."users_role_enum_old" AS ENUM('admin', 'branch', 'user')`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."users" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."users" ALTER COLUMN "role" TYPE "yaazoru"."users_role_enum_old" USING "role"::"text"::"yaazoru"."users_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."users" ALTER COLUMN "role" SET DEFAULT 'branch'`);
        await queryRunner.query(`DROP TYPE "yaazoru"."users_role_enum"`);
        await queryRunner.query(`ALTER TYPE "yaazoru"."users_role_enum_old" RENAME TO "users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."users" ALTER COLUMN "address" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."users" ALTER COLUMN "city" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."users" ALTER COLUMN "id_number" SET NOT NULL`);
        await queryRunner.query(`CREATE INDEX "idx_customers_created_at" ON "yaazoru"."customers" ("created_at") `);
        await queryRunner.query(`CREATE INDEX "idx_customers_id_number" ON "yaazoru"."customers" ("id_number") `);
    }

}
