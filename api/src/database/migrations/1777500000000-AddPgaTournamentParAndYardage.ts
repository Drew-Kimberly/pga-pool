import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPgaTournamentParAndYardage1777500000000 implements MigrationInterface {
  name = 'AddPgaTournamentParAndYardage1777500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "pga_tournament"
        ADD COLUMN "par" int
    `);

    await queryRunner.query(`
      ALTER TABLE "pga_tournament"
        ADD COLUMN "yardage" varchar(32)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "pga_tournament"
        DROP COLUMN "yardage"
    `);

    await queryRunner.query(`
      ALTER TABLE "pga_tournament"
        DROP COLUMN "par"
    `);
  }
}
