import { MigrationInterface, QueryRunner } from 'typeorm';

export class Auto1710694389671 implements MigrationInterface {
    name = 'Auto1710694389671';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "token" ("id" SERIAL NOT NULL, "refreshToken" text NOT NULL, "userId" integer, CONSTRAINT "REL_94f168faad896c0786646fa3d4" UNIQUE ("userId"), CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "article" ("id" SERIAL NOT NULL, "name" text NOT NULL, "text" text NOT NULL, "userId" integer, CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" text NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "assignedRoles" text NOT NULL DEFAULT '["Viewer"]', "tokenId" integer, "roleId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_63301650f99948e1ff5e0af00b" UNIQUE ("tokenId"), CONSTRAINT "REL_c28e52f758e7bbc53828db9219" UNIQUE ("roleId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "token" ADD CONSTRAINT "FK_94f168faad896c0786646fa3d4a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "article" ADD CONSTRAINT "FK_636f17dadfea1ffb4a412296a28" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "user" ADD CONSTRAINT "FK_63301650f99948e1ff5e0af00b5" FOREIGN KEY ("tokenId") REFERENCES "token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_63301650f99948e1ff5e0af00b5"`);
        await queryRunner.query(`ALTER TABLE "article" DROP CONSTRAINT "FK_636f17dadfea1ffb4a412296a28"`);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_94f168faad896c0786646fa3d4a"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "article"`);
        await queryRunner.query(`DROP TABLE "token"`);
    }
}
