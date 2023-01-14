import { MigrationInterface, QueryRunner } from 'typeorm';

export class PgaTournamentPlayerAddCutStatus1673725091577 implements MigrationInterface {
  name = 'PgaTournamentPlayerAddCutStatus1673725091577';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TYPE "public"."pga_tournament_player_status_enum"
            RENAME TO "pga_tournament_player_status_enum_old"
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."pga_tournament_player_status_enum" AS ENUM('active', 'wd', 'cut')
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament_player"
            ALTER COLUMN "status" TYPE "public"."pga_tournament_player_status_enum" USING "status"::"text"::"public"."pga_tournament_player_status_enum"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."pga_tournament_player_status_enum_old"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."pga_tournament_player_status_enum_old" AS ENUM('active', 'wd')
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament_player"
            ALTER COLUMN "status" TYPE "public"."pga_tournament_player_status_enum_old" USING "status"::"text"::"public"."pga_tournament_player_status_enum_old"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."pga_tournament_player_status_enum"
        `);
    await queryRunner.query(`
            ALTER TYPE "public"."pga_tournament_player_status_enum_old"
            RENAME TO "pga_tournament_player_status_enum"
        `);
  }
}
