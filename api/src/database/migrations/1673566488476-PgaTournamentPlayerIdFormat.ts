import { MigrationInterface, QueryRunner } from 'typeorm';

export class PgaTournamentPlayerIdFormat1673566488476 implements MigrationInterface {
  name = 'PgaTournamentPlayerIdFormat1673566488476';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick" DROP CONSTRAINT "FK_48e6fa3d3b370eae026641fe78b"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament_player" DROP CONSTRAINT "PK_51da2dca43823a27a7fb32953df"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament_player" DROP COLUMN "id"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament_player"
            ADD "id" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament_player"
            ADD CONSTRAINT "PK_51da2dca43823a27a7fb32953df" PRIMARY KEY ("id")
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick" DROP CONSTRAINT "UQ_20f417d740b5226d0b6f17549d6"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick" DROP COLUMN "pga_tournament_player"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick"
            ADD "pga_tournament_player" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick"
            ADD CONSTRAINT "UQ_20f417d740b5226d0b6f17549d6" UNIQUE ("pool_user", "pga_tournament_player")
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick"
            ADD CONSTRAINT "FK_48e6fa3d3b370eae026641fe78b" FOREIGN KEY ("pga_tournament_player") REFERENCES "pga_tournament_player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick" DROP CONSTRAINT "FK_48e6fa3d3b370eae026641fe78b"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick" DROP CONSTRAINT "UQ_20f417d740b5226d0b6f17549d6"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick" DROP COLUMN "pga_tournament_player"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick"
            ADD "pga_tournament_player" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick"
            ADD CONSTRAINT "UQ_20f417d740b5226d0b6f17549d6" UNIQUE ("pool_user", "pga_tournament_player")
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament_player" DROP CONSTRAINT "PK_51da2dca43823a27a7fb32953df"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament_player" DROP COLUMN "id"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament_player"
            ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_tournament_player"
            ADD CONSTRAINT "PK_51da2dca43823a27a7fb32953df" PRIMARY KEY ("id")
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick"
            ADD CONSTRAINT "FK_48e6fa3d3b370eae026641fe78b" FOREIGN KEY ("pga_tournament_player") REFERENCES "pga_tournament_player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
