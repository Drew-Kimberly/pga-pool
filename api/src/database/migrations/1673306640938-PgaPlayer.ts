import { MigrationInterface, QueryRunner } from 'typeorm';

export class PgaPlayer1673306640938 implements MigrationInterface {
  name = 'PgaPlayer1673306640938';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "pga_player" (
                "id" integer NOT NULL,
                "name" text NOT NULL,
                CONSTRAINT "PK_1e30fa3b6991b1eea95f2049471" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "pga_player"
        `);
  }
}
