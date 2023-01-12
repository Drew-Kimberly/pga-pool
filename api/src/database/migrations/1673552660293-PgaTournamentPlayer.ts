import { MigrationInterface, QueryRunner } from 'typeorm';

export class PgaTournamentPlayer1673552660293 implements MigrationInterface {
  name = 'PgaTournamentPlayer1673552660293';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE "public"."pga_tournament_player_status_enum" AS ENUM('active', 'wd')
        `);
    await queryRunner.query(`
            CREATE TABLE "pga_tournament_player" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "active" boolean NOT NULL,
                "status" "public"."pga_tournament_player_status_enum" NOT NULL,
                "is_round_complete" boolean NOT NULL,
                "current_round" integer,
                "current_hole" integer,
                "starting_hole" integer NOT NULL DEFAULT '1',
                "tee_time" character varying(16),
                "score_total" integer,
                "score_thru" integer,
                "current_position" integer,
                "pga_player" integer,
                "pga_tournament" character varying,
                CONSTRAINT "PK_51da2dca43823a27a7fb32953df" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament_player"
            ADD CONSTRAINT "FK_aabb26289c91c19dd5b94d6eff0" FOREIGN KEY ("pga_player") REFERENCES "pga_player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament_player"
            ADD CONSTRAINT "FK_4e55d450b928207cb7117223516" FOREIGN KEY ("pga_tournament") REFERENCES "pga_tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "pga_tournament_player" DROP CONSTRAINT "FK_4e55d450b928207cb7117223516"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament_player" DROP CONSTRAINT "FK_aabb26289c91c19dd5b94d6eff0"
        `);
    await queryRunner.query(`
            DROP TABLE "pga_tournament_player"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."pga_tournament_player_status_enum"
        `);
  }
}
