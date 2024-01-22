import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLeagueUser1705675213907 implements MigrationInterface {
  name = 'AddLeagueUser1705675213907';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "league_user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "league_id" uuid NOT NULL,
                "user_id" character varying NOT NULL,
                "is_owner" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_12289821a4080fad99b3870a165" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "league_user"
            ADD CONSTRAINT "FK_8a9bb31e511097f1fba50dbb1c2" FOREIGN KEY ("league_id") REFERENCES "league"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "league_user"
            ADD CONSTRAINT "FK_2f0fa73cd24464f8c657026f603" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "league_user" DROP CONSTRAINT "FK_2f0fa73cd24464f8c657026f603"
        `);
    await queryRunner.query(`
            ALTER TABLE "league_user" DROP CONSTRAINT "FK_8a9bb31e511097f1fba50dbb1c2"
        `);
    await queryRunner.query(`
            DROP TABLE "league_user"
        `);
  }
}
