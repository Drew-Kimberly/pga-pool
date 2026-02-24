import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPgaPlayerCountryFields1777200000000 implements MigrationInterface {
  name = 'AddPgaPlayerCountryFields1777200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "pga_player"
      ADD "country" character varying(255)
    `);
    await queryRunner.query(`
      ALTER TABLE "pga_player"
      ADD "country_flag" character varying(10)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "pga_player" DROP COLUMN "country_flag"
    `);
    await queryRunner.query(`
      ALTER TABLE "pga_player" DROP COLUMN "country"
    `);
  }
}
