import { MigrationInterface, QueryRunner } from 'typeorm';

export class PoolRefactor1706499520631 implements MigrationInterface {
  name = 'PoolRefactor1706499520631';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "pool_user" DROP CONSTRAINT "FK_82898512d41cbe032d67832fa51"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user" DROP CONSTRAINT "FK_2d3526b76fbb5f1c44f8c11dbe3"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament" DROP CONSTRAINT "FK_9abe74be0d234b2aa744f7f7fa1"
        `);
    await queryRunner.query(`
            CREATE TABLE "pool_tournament_user_pick" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "pool_tournamnet_user_id" uuid NOT NULL,
                "pool_tournament_player_id" uuid NOT NULL,
                CONSTRAINT "UQ_affb79cd8eae19396ee5917a666" UNIQUE (
                    "pool_tournamnet_user_id",
                    "pool_tournament_player_id"
                ),
                CONSTRAINT "PK_47a1ed83e7a7da68c45a84c7426" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "pool_tournament_user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "tournament_score" integer,
                "projected_fedex_cup_points" numeric(10, 3) NOT NULL DEFAULT '0',
                "pool_tournament_id" uuid NOT NULL,
                "pool_user_id" uuid NOT NULL,
                "league_id" uuid NOT NULL,
                CONSTRAINT "PK_a84217d554adefdf5675b0ff5b7" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."pool_type_enum" AS ENUM('single_tournament', 'season')
        `);
    await queryRunner.query(`
            CREATE TABLE "pool" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "year" integer NOT NULL,
                "name" citext NOT NULL,
                "type" "public"."pool_type_enum" NOT NULL,
                "settings" jsonb NOT NULL,
                "league_id" uuid NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_db1bfe411e1516c01120b85f8fe" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user" DROP COLUMN "score"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user" DROP COLUMN "pool_tournament"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user" DROP COLUMN "projected_fedex_cup_points"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user" DROP COLUMN "user"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament" DROP COLUMN "active"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament" DROP CONSTRAINT "REL_9abe74be0d234b2aa744f7f7fa"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament" DROP COLUMN "pga_tournament"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user"
            ADD "pool_score" numeric(10, 3) NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user"
            ADD "pool_id" uuid NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user"
            ADD "user_id" uuid NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user"
            ADD "league_id" uuid NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user"
            ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user"
            ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament"
            ADD "pool_id" uuid NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament"
            ADD "pga_tournament_id" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament"
            ADD CONSTRAINT "UQ_4f43d324a1bbc7b7232e0bf45aa" UNIQUE ("pga_tournament_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament"
            ADD "league_id" uuid NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament_user_pick"
            ADD CONSTRAINT "FK_26b21a4309691507f56d534bbb5" FOREIGN KEY ("pool_tournamnet_user_id") REFERENCES "pool_tournament_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament_user_pick"
            ADD CONSTRAINT "FK_ce4b9d9ac018eb93de6504f77d5" FOREIGN KEY ("pool_tournament_player_id") REFERENCES "pool_tournament_player"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user"
            ADD CONSTRAINT "FK_059e786580a5e6b3d1ffc9a8bc9" FOREIGN KEY ("pool_id") REFERENCES "pool"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user"
            ADD CONSTRAINT "FK_67feb31fadc09fa49a58e50d026" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user"
            ADD CONSTRAINT "FK_e86669ec4d1131f4039269199fd" FOREIGN KEY ("league_id") REFERENCES "league"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament_user"
            ADD CONSTRAINT "FK_9450e89d2333bd5f888837ac738" FOREIGN KEY ("pool_tournament_id") REFERENCES "pool_tournament"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament_user"
            ADD CONSTRAINT "FK_d624790228c1e4257121b5156c8" FOREIGN KEY ("pool_user_id") REFERENCES "pool"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament_user"
            ADD CONSTRAINT "FK_10b0fa02b0416fb0872ca419b69" FOREIGN KEY ("league_id") REFERENCES "league"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament"
            ADD CONSTRAINT "FK_887dbe9730547635dc9adeed622" FOREIGN KEY ("pool_id") REFERENCES "pool"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament"
            ADD CONSTRAINT "FK_4f43d324a1bbc7b7232e0bf45aa" FOREIGN KEY ("pga_tournament_id") REFERENCES "pga_tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament"
            ADD CONSTRAINT "FK_3e89f43d7e8382a9456962cd0d7" FOREIGN KEY ("league_id") REFERENCES "league"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "pool"
            ADD CONSTRAINT "FK_f6c9fff22b5d713c87c5e380df1" FOREIGN KEY ("league_id") REFERENCES "league"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "pool" DROP CONSTRAINT "FK_f6c9fff22b5d713c87c5e380df1"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament" DROP CONSTRAINT "FK_3e89f43d7e8382a9456962cd0d7"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament" DROP CONSTRAINT "FK_4f43d324a1bbc7b7232e0bf45aa"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament" DROP CONSTRAINT "FK_887dbe9730547635dc9adeed622"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament_user" DROP CONSTRAINT "FK_10b0fa02b0416fb0872ca419b69"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament_user" DROP CONSTRAINT "FK_d624790228c1e4257121b5156c8"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament_user" DROP CONSTRAINT "FK_9450e89d2333bd5f888837ac738"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user" DROP CONSTRAINT "FK_e86669ec4d1131f4039269199fd"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user" DROP CONSTRAINT "FK_67feb31fadc09fa49a58e50d026"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user" DROP CONSTRAINT "FK_059e786580a5e6b3d1ffc9a8bc9"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament_user_pick" DROP CONSTRAINT "FK_ce4b9d9ac018eb93de6504f77d5"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament_user_pick" DROP CONSTRAINT "FK_26b21a4309691507f56d534bbb5"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament" DROP COLUMN "league_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament" DROP CONSTRAINT "UQ_4f43d324a1bbc7b7232e0bf45aa"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament" DROP COLUMN "pga_tournament_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament" DROP COLUMN "pool_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user" DROP COLUMN "updated_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user" DROP COLUMN "created_at"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user" DROP COLUMN "league_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user" DROP COLUMN "user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user" DROP COLUMN "pool_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user" DROP COLUMN "pool_score"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament"
            ADD "pga_tournament" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament"
            ADD CONSTRAINT "REL_9abe74be0d234b2aa744f7f7fa" UNIQUE ("pga_tournament")
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament"
            ADD "active" boolean NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user"
            ADD "user" uuid NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user"
            ADD "projected_fedex_cup_points" numeric(10, 3) NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user"
            ADD "pool_tournament" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user"
            ADD "score" integer
        `);
    await queryRunner.query(`
            DROP TABLE "pool"
        `);
    await queryRunner.query(`
            DROP TYPE "public"."pool_type_enum"
        `);
    await queryRunner.query(`
            DROP TABLE "pool_tournament_user"
        `);
    await queryRunner.query(`
            DROP TABLE "pool_tournament_user_pick"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_tournament"
            ADD CONSTRAINT "FK_9abe74be0d234b2aa744f7f7fa1" FOREIGN KEY ("pga_tournament") REFERENCES "pga_tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user"
            ADD CONSTRAINT "FK_2d3526b76fbb5f1c44f8c11dbe3" FOREIGN KEY ("user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user"
            ADD CONSTRAINT "FK_82898512d41cbe032d67832fa51" FOREIGN KEY ("pool_tournament") REFERENCES "pool_tournament"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
