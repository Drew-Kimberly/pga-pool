import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOfficialFedexCupPoints1769902000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "pga_tournament_player"
            ADD "official_fedex_cup_points" numeric(10, 3)
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "official_fedex_cup_points_calculated" boolean NOT NULL DEFAULT false
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "official_fedex_cup_points_calculated"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament_player" DROP COLUMN "official_fedex_cup_points"
        `);
  }
}
