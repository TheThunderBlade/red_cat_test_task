import { MigrationInterface, QueryRunner } from 'typeorm';

export class Roles1710694389672 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "role" (name) VALUES 
            ('Admin'),
            ('Editor'),
            ('Viewer');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "role";
        `);
    }
}
