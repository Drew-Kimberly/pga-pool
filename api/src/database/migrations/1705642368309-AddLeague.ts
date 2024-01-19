import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLeague1705642368309 implements MigrationInterface {
  name = 'AddLeague1705642368309';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "league" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" citext NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "PK_0bd74b698f9e28875df738f7864" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "league"
        `);
  }
}
