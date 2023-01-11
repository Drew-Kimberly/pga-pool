import { MigrationInterface, QueryRunner } from 'typeorm';

export class PgaTournament1673450932369 implements MigrationInterface {
  name = 'PgaTournament1673450932369';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."pga_tournament_format_enum" AS ENUM(
                'stroke',
                'match',
                'team',
                'team-match',
                'stableford'
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "pga_tournament" (
                "id" character varying NOT NULL,
                "full_name" citext NOT NULL,
                "short_name" citext NOT NULL,
                "tournament_id" character varying(32) NOT NULL,
                "year" integer NOT NULL,
                "week_number" integer NOT NULL,
                "start_date" date NOT NULL,
                "end_date" date NOT NULL,
                "format" "public"."pga_tournament_format_enum" NOT NULL,
                "fedex_cup_purse" integer NOT NULL,
                "fedex_cup_winner_points" integer NOT NULL,
                CONSTRAINT "PK_20d2a1cf8e48542123995068978" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "pga_tournament"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."pga_tournament_format_enum"
        `);
  }
}
