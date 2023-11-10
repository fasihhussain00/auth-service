import { MigrationInterface, QueryRunner } from "typeorm";

export class AuthInitialSchema1699536035005 implements MigrationInterface {
    name = 'AuthInitialSchema1699536035005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "auth" ("id" SERIAL NOT NULL, "app_id" integer NOT NULL, "type" character varying NOT NULL, "config" json NOT NULL, "metadata" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "auth_pk" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "app_auth_uk" ON "auth" ("app_id", "type") WHERE (deleted_at IS NULL)`);
        await queryRunner.query(`CREATE TABLE "app" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "account_id" integer NOT NULL, "key" character varying NOT NULL, "secret" character varying NOT NULL, "cors_origins" text array NOT NULL, "allowed_hosts" text array NOT NULL DEFAULT '{}', "allowed_email_hosts" text array NOT NULL DEFAULT '{}', "magic_link_template" character varying, "reset_password_template" character varying, "notification_type" character varying, "notification_config" json, "metadata" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "app_pk" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "account" ("id" SERIAL NOT NULL, "name" character varying, "username" character varying NOT NULL, "password" character varying NOT NULL, "metadata" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "account_pk" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "app_id" integer NOT NULL, "source_id" character varying, "name" character varying, "email" character varying NOT NULL, "phone" character varying, "username" character varying, "password" character varying, "issued_token" character varying, "metadata" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "user_pk" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "app_user_uk" ON "user" ("app_id", "email") WHERE (deleted_at IS NULL)`);
        await queryRunner.query(`ALTER TABLE "auth" ADD CONSTRAINT "app_auth_fk" FOREIGN KEY ("app_id") REFERENCES "app"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "app" ADD CONSTRAINT "account_app_fk" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "app_user_fk" FOREIGN KEY ("app_id") REFERENCES "app"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "app_user_fk"`);
        await queryRunner.query(`ALTER TABLE "app" DROP CONSTRAINT "account_app_fk"`);
        await queryRunner.query(`ALTER TABLE "auth" DROP CONSTRAINT "app_auth_fk"`);
        await queryRunner.query(`DROP INDEX "public"."app_user_uk"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP TABLE "app"`);
        await queryRunner.query(`DROP INDEX "public"."app_auth_uk"`);
        await queryRunner.query(`DROP TABLE "auth"`);
    }

}
