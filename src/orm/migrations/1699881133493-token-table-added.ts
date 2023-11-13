import { MigrationInterface, QueryRunner } from "typeorm";

export class TokenTableAdded1699881133493 implements MigrationInterface {
    name = 'TokenTableAdded1699881133493'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "token" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "used" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "token_pk" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "token"`);
    }

}
