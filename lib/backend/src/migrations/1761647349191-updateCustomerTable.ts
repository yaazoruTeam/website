import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCustomerTable1761647349191 implements MigrationInterface {
    name = 'UpdateCustomerTable1761647349191'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop old indexes (they will be recreated with new names)
        await queryRunner.query(`DROP INDEX IF EXISTS "yaazoru"."idx_customers_email"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "yaazoru"."idx_customers_status"`);
        
        // Make id_number nullable
        await queryRunner.query(`ALTER TABLE "yaazoru"."customers" ALTER COLUMN "id_number" DROP NOT NULL`);
        
        // Ensure phone_number has UNIQUE constraint
        await queryRunner.query(`ALTER TABLE "yaazoru"."customers" ADD CONSTRAINT "UQ_46c5f573cb24bdc6e81b8ef2504" UNIQUE ("phone_number")`);
        
        // Update email column (reduce length to 40)
        await queryRunner.query(`ALTER TABLE "yaazoru"."customers" DROP CONSTRAINT "customers_email_key"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."customers" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."customers" ADD "email" character varying(40)`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."customers" ADD CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03" UNIQUE ("email")`);
        
        // Make city and address nullable
        await queryRunner.query(`ALTER TABLE "yaazoru"."customers" ALTER COLUMN "city" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."customers" ALTER COLUMN "address" DROP NOT NULL`);
        
        // Create new indexes with TypeORM-generated names
        await queryRunner.query(`CREATE INDEX "IDX_1d497ab89fbba95db7a464ed57" ON "yaazoru"."customers" ("city") `);
        await queryRunner.query(`CREATE INDEX "IDX_589e5e6434f0e8628aa2ad33e1" ON "yaazoru"."customers" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_a8fcf679692db1c886e7f15d2b" ON "yaazoru"."customers" ("created_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop new indexes
        await queryRunner.query(`DROP INDEX IF EXISTS "yaazoru"."IDX_a8fcf679692db1c886e7f15d2b"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "yaazoru"."IDX_589e5e6434f0e8628aa2ad33e1"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "yaazoru"."IDX_1d497ab89fbba95db7a464ed57"`);
        
        // Revert address and city to NOT NULL
        await queryRunner.query(`ALTER TABLE "yaazoru"."customers" ALTER COLUMN "address" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."customers" ALTER COLUMN "city" SET NOT NULL`);
        
        // Revert email column (back to 100 chars)
        await queryRunner.query(`ALTER TABLE "yaazoru"."customers" DROP CONSTRAINT "UQ_8536b8b85c06969f84f0c098b03"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."customers" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."customers" ADD "email" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "yaazoru"."customers" ADD CONSTRAINT "customers_email_key" UNIQUE ("email")`);
        
        // Remove phone_number UNIQUE constraint
        await queryRunner.query(`ALTER TABLE "yaazoru"."customers" DROP CONSTRAINT IF EXISTS "UQ_46c5f573cb24bdc6e81b8ef2504"`);
        
        // Make id_number NOT NULL again
        await queryRunner.query(`ALTER TABLE "yaazoru"."customers" ALTER COLUMN "id_number" SET NOT NULL`);
        
        // Recreate old indexes
        await queryRunner.query(`CREATE INDEX "idx_customers_status" ON "yaazoru"."customers" ("status") `);
        await queryRunner.query(`CREATE INDEX "idx_customers_email" ON "yaazoru"."customers" ("email") `);
    }

}
