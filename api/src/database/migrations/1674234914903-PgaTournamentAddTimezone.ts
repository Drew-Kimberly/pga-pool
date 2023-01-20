import { MigrationInterface, QueryRunner } from 'typeorm';

export class PgaTournamentAddTimezone1674234914903 implements MigrationInterface {
  name = 'PgaTournamentAddTimezone1674234914903';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "time_zone" character varying(64) NOT NULL DEFAULT 'America/New_York'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "time_zone"
        `);
  }
}
