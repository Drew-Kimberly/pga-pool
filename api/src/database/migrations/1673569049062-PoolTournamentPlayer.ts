import { MigrationInterface, QueryRunner } from 'typeorm';

export class PoolTournamentPlayer1673569049062 implements MigrationInterface {
  name = 'PoolTournamentPlayer1673569049062';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick" DROP CONSTRAINT "FK_48e6fa3d3b370eae026641fe78b"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick" DROP CONSTRAINT "FK_c2a02a695ef9c80c78d85033756"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick" DROP CONSTRAINT "UQ_20f417d740b5226d0b6f17549d6"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick"
                RENAME COLUMN "pga_tournament_player" TO "pool_tournament_player"
        `);
    await queryRunner.query(`
            CREATE TABLE "pool_tournament_player" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "tier" integer NOT NULL,
                "pga_tournament_player" character varying,
                "pool_tournament" uuid,
                CONSTRAINT "REL_cbcabd4b0453def16e670b4d72" UNIQUE ("pga_tournament_player"),
                CONSTRAINT "PK_0546f4e840f2e21e10d1641d394" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick" DROP COLUMN "pool_tournament_player"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick"
            ADD "pool_tournament_player" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick"
            ADD CONSTRAINT "UQ_212857ad64835b13fa0f9703773" UNIQUE ("pool_user", "pool_tournament_player")
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament_player"
            ADD CONSTRAINT "FK_cbcabd4b0453def16e670b4d728" FOREIGN KEY ("pga_tournament_player") REFERENCES "pga_tournament_player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament_player"
            ADD CONSTRAINT "FK_05db7497f59908327f4bbc89a96" FOREIGN KEY ("pool_tournament") REFERENCES "pool_tournament"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick"
            ADD CONSTRAINT "FK_c2a02a695ef9c80c78d85033756" FOREIGN KEY ("pool_user") REFERENCES "pool_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick"
            ADD CONSTRAINT "FK_38ddb0d2edfff0ea8b0859fe8e0" FOREIGN KEY ("pool_tournament_player") REFERENCES "pool_tournament_player"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick" DROP CONSTRAINT "FK_38ddb0d2edfff0ea8b0859fe8e0"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick" DROP CONSTRAINT "FK_c2a02a695ef9c80c78d85033756"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament_player" DROP CONSTRAINT "FK_05db7497f59908327f4bbc89a96"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament_player" DROP CONSTRAINT "FK_cbcabd4b0453def16e670b4d728"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick" DROP CONSTRAINT "UQ_212857ad64835b13fa0f9703773"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick" DROP COLUMN "pool_tournament_player"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick"
            ADD "pool_tournament_player" character varying
        `);
    await queryRunner.query(`
            DROP TABLE "pool_tournament_player"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick"
                RENAME COLUMN "pool_tournament_player" TO "pga_tournament_player"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick"
            ADD CONSTRAINT "UQ_20f417d740b5226d0b6f17549d6" UNIQUE ("pool_user", "pga_tournament_player")
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick"
            ADD CONSTRAINT "FK_c2a02a695ef9c80c78d85033756" FOREIGN KEY ("pool_user") REFERENCES "pool_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick"
            ADD CONSTRAINT "FK_48e6fa3d3b370eae026641fe78b" FOREIGN KEY ("pga_tournament_player") REFERENCES "pga_tournament_player"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
