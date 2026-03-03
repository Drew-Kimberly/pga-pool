import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterPgaTournamentYardageToInt1777500100000 implements MigrationInterface {
  name = 'AlterPgaTournamentYardageToInt1777500100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "pga_tournament"
        ALTER COLUMN "yardage" TYPE int USING "yardage"::int
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "pga_tournament"
        ALTER COLUMN "yardage" TYPE varchar(32) USING "yardage"::varchar
    `);
  }
}
