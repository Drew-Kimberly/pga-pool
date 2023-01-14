import { MigrationInterface, QueryRunner } from 'typeorm';

export class PgaTournamentPlayerCurrentPositionType1673716895800 implements MigrationInterface {
  name = 'PgaTournamentPlayerCurrentPositionType1673716895800';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "pga_tournament_player" DROP COLUMN "current_position"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament_player"
            ADD "current_position" character varying(16)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "pga_tournament_player" DROP COLUMN "current_position"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament_player"
            ADD "current_position" integer
        `);
  }
}
