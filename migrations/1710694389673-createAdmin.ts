import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class CreateAdmin1710694389673 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const password = await bcrypt.hash('1111', 10);
        await queryRunner.query(`
            INSERT INTO "user" (email, password, "assignedRoles", "roleId") VALUES 
            ('admin@gmail.com', '${password}', '["Admin", "Editor", "Viewer"]', 1);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "user" where email = "admin@gmail.com";
        `);
    }
}
