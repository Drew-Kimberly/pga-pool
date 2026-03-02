import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOddsAndFieldPublishedAt1777400000000 implements MigrationInterface {
  name = 'AddOddsAndFieldPublishedAt1777400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "pool_tournament_player"
        ADD COLUMN "odds" varchar
    `);

    await queryRunner.query(`
      ALTER TABLE "pool_tournament"
        ADD COLUMN "field_published_at" timestamptz
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "pool_tournament"
        DROP COLUMN "field_published_at"
    `);

    await queryRunner.query(`
      ALTER TABLE "pool_tournament_player"
        DROP COLUMN "odds"
    `);
  }
}
