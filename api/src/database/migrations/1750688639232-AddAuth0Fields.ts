import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuth0Fields1750688639232 implements MigrationInterface {
  name = 'AddAuth0Fields1750688639232';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "auth0_id" character varying(255)
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "UQ_5222bec366027bdf8b112120013" UNIQUE ("auth0_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "picture_url" text
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "last_login" TIMESTAMP WITH TIME ZONE
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "auth_provider" character varying(50)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "auth_provider"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "last_login"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "picture_url"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "UQ_5222bec366027bdf8b112120013"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "auth0_id"
        `);
  }
}
