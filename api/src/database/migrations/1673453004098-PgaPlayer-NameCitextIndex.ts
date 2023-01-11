import { MigrationInterface, QueryRunner } from 'typeorm';

export class PgaPlayerNameCitextIndex1673453004098 implements MigrationInterface {
  name = 'PgaPlayerNameCitextIndex1673453004098';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "pga_player" DROP COLUMN "name"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_player"
            ADD "name" citext NOT NULL
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_e2582099b30e8e19324a1bf926" ON "pga_player" ("name")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_e2582099b30e8e19324a1bf926"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_player" DROP COLUMN "name"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_player"
            ADD "name" text NOT NULL
        `);
  }
}
