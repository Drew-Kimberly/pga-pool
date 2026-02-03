import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixPoolTournamentUserPoolUserFk1775130000000 implements MigrationInterface {
  name = 'FixPoolTournamentUserPoolUserFk1775130000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "pool_tournament_user" DROP CONSTRAINT "FK_d624790228c1e4257121b5156c8"'
    );
    await queryRunner.query(
      'ALTER TABLE "pool_tournament_user" ADD CONSTRAINT "FK_pool_tournament_user_pool_user" FOREIGN KEY ("pool_user_id") REFERENCES "pool_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "pool_tournament_user" DROP CONSTRAINT "FK_pool_tournament_user_pool_user"'
    );
    await queryRunner.query(
      'ALTER TABLE "pool_tournament_user" ADD CONSTRAINT "FK_d624790228c1e4257121b5156c8" FOREIGN KEY ("pool_user_id") REFERENCES "pool"("id") ON DELETE CASCADE ON UPDATE NO ACTION'
    );
  }
}
