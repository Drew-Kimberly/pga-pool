import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePgaPlayer1704641983034 implements MigrationInterface {
  name = 'UpdatePgaPlayer1704641983034';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "pga_player"
            ADD "short_name" citext
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_player"
            ADD "active" boolean NOT NULL DEFAULT false
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_player"
            ADD "first_name" citext
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_player"
            ADD "last_name" citext
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_player"
            ADD "headshot_url" character varying(255)
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_a3acd826b678b0999c10f3643a" ON "pga_player" ("short_name")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_a3acd826b678b0999c10f3643a"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_player" DROP COLUMN "headshot_url"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_player" DROP COLUMN "last_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_player" DROP COLUMN "first_name"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_player" DROP COLUMN "active"
        `);
    await queryRunner.query(`
            ALTER TABLE "pga_player" DROP COLUMN "short_name"
        `);
  }
}
