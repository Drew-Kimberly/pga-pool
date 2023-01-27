import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProjFedexCupPoints1674831154092 implements MigrationInterface {
  name = 'ProjFedexCupPoints1674831154092';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "pga_tournament_player"
            ADD "projected_fedex_cup_points" numeric(8, 3) NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user"
            ADD "projected_fedex_cup_points" numeric(10, 3) NOT NULL DEFAULT '0'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "pool_user" DROP COLUMN "projected_fedex_cup_points"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament_player" DROP COLUMN "projected_fedex_cup_points"
        `);
  }
}
