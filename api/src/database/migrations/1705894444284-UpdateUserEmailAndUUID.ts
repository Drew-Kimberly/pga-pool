import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserEmailAndUUID1705894444284 implements MigrationInterface {
  name = 'UpdateUserEmailAndUUID1705894444284';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "email" citext
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "is_admin" boolean NOT NULL DEFAULT false
        `);
    await queryRunner.query(`
            ALTER TABLE "league_user" DROP CONSTRAINT "FK_2f0fa73cd24464f8c657026f603"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user" DROP CONSTRAINT "FK_2d3526b76fbb5f1c44f8c11dbe3"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "id"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "nickname" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "league_user" DROP COLUMN "user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "league_user"
            ADD "user_id" uuid NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user" DROP COLUMN "user"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user"
            ADD "user" uuid NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "league_user"
            ADD CONSTRAINT "FK_2f0fa73cd24464f8c657026f603" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user"
            ADD CONSTRAINT "FK_2d3526b76fbb5f1c44f8c11dbe3" FOREIGN KEY ("user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "pool_user" DROP CONSTRAINT "FK_2d3526b76fbb5f1c44f8c11dbe3"
        `);
    await queryRunner.query(`
            ALTER TABLE "league_user" DROP CONSTRAINT "FK_2f0fa73cd24464f8c657026f603"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user" DROP COLUMN "user"
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user"
            ADD "user" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "league_user" DROP COLUMN "user_id"
        `);
    await queryRunner.query(`
            ALTER TABLE "league_user"
            ADD "user_id" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "nickname"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "id"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "id" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
        `);
    await queryRunner.query(`
            ALTER TABLE "pool_user"
            ADD CONSTRAINT "FK_2d3526b76fbb5f1c44f8c11dbe3" FOREIGN KEY ("user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "league_user"
            ADD CONSTRAINT "FK_2f0fa73cd24464f8c657026f603" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "is_admin"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "email"
        `);
  }
}
