import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatUserTable1762160056448 implements MigrationInterface {
    name = 'CreatUserTable1762160056448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "yaazoru"."users" ("user_id" SERIAL NOT NULL, "first_name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, "id_number" character varying(9) NOT NULL, "phone_number" character varying(20) NOT NULL, "additional_phone" character varying(20), "email" character varying(100) NOT NULL, "photo_url" character varying(255), "email_verified" boolean DEFAULT false, "google_uid" character varying(255), "city" character varying(100) NOT NULL, "address" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "user_name" character varying(100) NOT NULL, "role" "yaazoru"."users_role_enum" NOT NULL DEFAULT 'branch', "status" "yaazoru"."users_status_enum" NOT NULL DEFAULT 'active', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a11ca4d60c50fa3bb467319e7cd" UNIQUE ("id_number"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_12bb12a74ae90e3293e34fad0ce" UNIQUE ("google_uid"), CONSTRAINT "UQ_074a1f262efaca6aba16f7ed920" UNIQUE ("user_name"), CONSTRAINT "UQ_12bb12a74ae90e3293e34fad0ce" UNIQUE ("google_uid"), CONSTRAINT "UQ_074a1f262efaca6aba16f7ed920" UNIQUE ("user_name"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_17d1817f241f10a3dbafb169fd2" UNIQUE ("phone_number"), CONSTRAINT "UQ_a11ca4d60c50fa3bb467319e7cd" UNIQUE ("id_number"), CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE INDEX "idx_users_city" ON "yaazoru"."users" ("city") `);
        await queryRunner.query(`CREATE INDEX "idx_users_user_name" ON "yaazoru"."users" ("user_name") `);
        await queryRunner.query(`CREATE INDEX "idx_users_status" ON "yaazoru"."users" ("status") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "yaazoru"."idx_users_status"`);
        await queryRunner.query(`DROP INDEX "yaazoru"."idx_users_user_name"`);
        await queryRunner.query(`DROP INDEX "yaazoru"."idx_users_city"`);
        await queryRunner.query(`DROP TABLE "yaazoru"."users"`);
    }

}
