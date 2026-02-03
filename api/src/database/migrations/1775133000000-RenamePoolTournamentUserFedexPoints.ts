import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenamePoolTournamentUserFedexPoints1775133000000 implements MigrationInterface {
  name = 'RenamePoolTournamentUserFedexPoints1775133000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "pool_tournament_user" RENAME COLUMN "projected_fedex_cup_points" TO "fedex_cup_points"'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "pool_tournament_user" RENAME COLUMN "fedex_cup_points" TO "projected_fedex_cup_points"'
    );
  }
}
