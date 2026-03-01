import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHoleAndStrokeTables1777300000000 implements MigrationInterface {
  name = 'AddHoleAndStrokeTables1777300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."pga_tournament_player_hole_status_enum"
        AS ENUM('birdie', 'bogey', 'eagle', 'double_bogey', 'par', 'none')
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."pga_tournament_player_stroke_type_enum"
        AS ENUM('stroke', 'penalty', 'drop', 'provisional')
    `);

    await queryRunner.query(`
      CREATE TABLE "pga_tournament_player_hole" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "pga_tournament_player_id" varchar NOT NULL,
        "round_number" int NOT NULL,
        "hole_number" int NOT NULL,
        "par" int NOT NULL,
        "score" int NOT NULL,
        "to_par" int NOT NULL,
        "status" "public"."pga_tournament_player_hole_status_enum" NOT NULL DEFAULT 'none',
        "yardage" int NOT NULL,
        "sequence" int NOT NULL,
        CONSTRAINT "UQ_hole_player_round_hole" UNIQUE ("pga_tournament_player_id", "round_number", "hole_number"),
        CONSTRAINT "PK_pga_tournament_player_hole" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_hole_player" ON "pga_tournament_player_hole" ("pga_tournament_player_id")
    `);

    await queryRunner.query(`
      ALTER TABLE "pga_tournament_player_hole"
        ADD CONSTRAINT "FK_hole_pga_tournament_player"
        FOREIGN KEY ("pga_tournament_player_id")
        REFERENCES "pga_tournament_player"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      CREATE TABLE "pga_tournament_player_stroke" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "pga_tournament_player_hole_id" uuid NOT NULL,
        "stroke_number" int NOT NULL,
        "from_location" varchar(64) NOT NULL,
        "from_location_code" varchar(16) NOT NULL,
        "to_location" varchar(64) NOT NULL,
        "to_location_code" varchar(16) NOT NULL,
        "stroke_type" "public"."pga_tournament_player_stroke_type_enum" NOT NULL DEFAULT 'stroke',
        "distance" varchar(32),
        "distance_remaining" varchar(32),
        "play_by_play" text,
        "is_final_stroke" boolean NOT NULL DEFAULT false,
        "ball_speed" decimal(6,2),
        "club_speed" decimal(6,2),
        "smash_factor" decimal(4,3),
        "launch_angle" decimal(5,2),
        "launch_spin" decimal(8,2),
        "spin_axis" decimal(6,2),
        "apex_height" decimal(7,2),
        "start_x" decimal(12,6),
        "start_y" decimal(12,6),
        "end_x" decimal(12,6),
        "end_y" decimal(12,6),
        CONSTRAINT "UQ_stroke_hole_number" UNIQUE ("pga_tournament_player_hole_id", "stroke_number"),
        CONSTRAINT "PK_pga_tournament_player_stroke" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_stroke_hole" ON "pga_tournament_player_stroke" ("pga_tournament_player_hole_id")
    `);

    await queryRunner.query(`
      ALTER TABLE "pga_tournament_player_stroke"
        ADD CONSTRAINT "FK_stroke_pga_tournament_player_hole"
        FOREIGN KEY ("pga_tournament_player_hole_id")
        REFERENCES "pga_tournament_player_hole"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pga_tournament_player_stroke" DROP CONSTRAINT "FK_stroke_pga_tournament_player_hole"`
    );
    await queryRunner.query(`DROP INDEX "idx_stroke_hole"`);
    await queryRunner.query(`DROP TABLE "pga_tournament_player_stroke"`);

    await queryRunner.query(
      `ALTER TABLE "pga_tournament_player_hole" DROP CONSTRAINT "FK_hole_pga_tournament_player"`
    );
    await queryRunner.query(`DROP INDEX "idx_hole_player"`);
    await queryRunner.query(`DROP TABLE "pga_tournament_player_hole"`);

    await queryRunner.query(`DROP TYPE "public"."pga_tournament_player_stroke_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."pga_tournament_player_hole_status_enum"`);
  }
}
