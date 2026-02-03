import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPoolTournamentScoresAreOfficial1775132000000 implements MigrationInterface {
  name = 'AddPoolTournamentScoresAreOfficial1775132000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "pool_tournament" ADD "scores_are_official" boolean NOT NULL DEFAULT false'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "pool_tournament" DROP COLUMN "scores_are_official"');
  }
}
