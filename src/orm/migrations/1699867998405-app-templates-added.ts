import { MigrationInterface, QueryRunner } from "typeorm";

export class AppTemplatesAdded1699867998405 implements MigrationInterface {
    name = 'AppTemplatesAdded1699867998405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app" DROP COLUMN "magic_link_template"`);
        await queryRunner.query(`ALTER TABLE "app" ADD "login_magic_link_template" character varying`);
        await queryRunner.query(`ALTER TABLE "app" ADD "sign_up_magic_link_template" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "app" DROP COLUMN "sign_up_magic_link_template"`);
        await queryRunner.query(`ALTER TABLE "app" DROP COLUMN "login_magic_link_template"`);
        await queryRunner.query(`ALTER TABLE "app" ADD "magic_link_template" character varying`);
    }

}
