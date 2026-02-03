import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropPoolUserPick1775131000000 implements MigrationInterface {
  name = 'DropPoolUserPick1775131000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS "pool_user_pick"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "pool_user_pick" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "pool_user" uuid,
        "pga_tournament_player" uuid,
        CONSTRAINT "UQ_20f417d740b5226d0b6f17549d6" UNIQUE ("pool_user", "pga_tournament_player"),
        CONSTRAINT "PK_9147e9ac78145a36856300e7024" PRIMARY KEY ("id")
      )
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
