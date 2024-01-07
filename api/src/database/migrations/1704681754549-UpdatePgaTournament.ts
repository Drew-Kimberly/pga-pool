import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePgaTournament1704681754549 implements MigrationInterface {
  name = 'UpdatePgaTournament1704681754549';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "time_zone"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "fedex_cup_winner_points"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "fedex_cup_purse"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "format"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."pga_tournament_format_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "week_number"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "short_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "full_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "name" citext NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "month" character varying(32) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "timezone" character varying(64) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "display_date" character varying(128) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "display_date_short" character varying(64) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "purse" integer NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "features" jsonb NOT NULL DEFAULT '[]'
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "fedex_cup_points" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "fedex_cup_event" boolean NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "scoring_format" character varying(64) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "tournament_status" character varying(64) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "round_status" character varying(64) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "current_round" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "course_name" citext NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "country" citext NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "country_code" character varying(16) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "state" citext NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "state_code" character varying(16) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "city" citext NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "previous_champion" citext
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "previous_champion_id" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "logo_url" character varying(255)
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "course_url" character varying(255)
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_player"
            ALTER COLUMN "short_name"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_player"
            ALTER COLUMN "first_name"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_player"
            ALTER COLUMN "last_name"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "start_date"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "start_date" TIMESTAMP WITH TIME ZONE NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "end_date"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "end_date" TIMESTAMP WITH TIME ZONE NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "end_date"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "end_date" date NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "start_date"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "start_date" date NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_player"
            ALTER COLUMN "last_name" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_player"
            ALTER COLUMN "first_name" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_player"
            ALTER COLUMN "short_name" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "course_url"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "logo_url"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "previous_champion_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "previous_champion"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "city"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "state_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "state"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "country_code"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "country"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "course_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "current_round"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "round_status"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "tournament_status"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "scoring_format"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "fedex_cup_event"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "fedex_cup_points"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "features"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "purse"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "display_date_short"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "display_date"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "timezone"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "month"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament" DROP COLUMN "name"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "full_name" citext NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "short_name" citext NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "week_number" integer NOT NULL
        `);
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
            ALTER TABLE "pga_tournament"
            ADD "format" "public"."pga_tournament_format_enum" NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "fedex_cup_purse" integer NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "fedex_cup_winner_points" integer NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament"
            ADD "time_zone" character varying(64) NOT NULL DEFAULT 'America/New_York'
        `);
  }
}
