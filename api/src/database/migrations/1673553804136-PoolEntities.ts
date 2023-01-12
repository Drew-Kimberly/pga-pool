import { MigrationInterface, QueryRunner } from 'typeorm';

export class PoolEntities1673553804136 implements MigrationInterface {
  name = 'PoolEntities1673553804136';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
            CREATE TABLE "pool_user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "score" integer,
                "pool_tournament" uuid,
                "user" character varying NOT NULL,
                CONSTRAINT "PK_307783d30e34176ec10b90d73fa" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "pool_tournament" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "active" boolean NOT NULL,
                "pga_tournament" character varying NOT NULL,
                CONSTRAINT "REL_9abe74be0d234b2aa744f7f7fa" UNIQUE ("pga_tournament"),
                CONSTRAINT "PK_5be844941cb53c536358ba15894" PRIMARY KEY ("id")
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
    await queryRunner.query(`
            ALTER TABLE "pool_user"
            ADD CONSTRAINT "FK_82898512d41cbe032d67832fa51" FOREIGN KEY ("pool_tournament") REFERENCES "pool_tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user"
            ADD CONSTRAINT "FK_2d3526b76fbb5f1c44f8c11dbe3" FOREIGN KEY ("user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament"
            ADD CONSTRAINT "FK_9abe74be0d234b2aa744f7f7fa1" FOREIGN KEY ("pga_tournament") REFERENCES "pga_tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "pool_tournament" DROP CONSTRAINT "FK_9abe74be0d234b2aa744f7f7fa1"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user" DROP CONSTRAINT "FK_2d3526b76fbb5f1c44f8c11dbe3"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user" DROP CONSTRAINT "FK_82898512d41cbe032d67832fa51"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick" DROP CONSTRAINT "FK_48e6fa3d3b370eae026641fe78b"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user_pick" DROP CONSTRAINT "FK_c2a02a695ef9c80c78d85033756"
        `);
    await queryRunner.query(`
            DROP TABLE "pool_tournament"
        `);
    await queryRunner.query(`
            DROP TABLE "pool_user"
        `);
    await queryRunner.query(`
            DROP TABLE "pool_user_pick"
        `);
  }
}
