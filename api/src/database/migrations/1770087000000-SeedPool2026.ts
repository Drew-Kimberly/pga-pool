import { MigrationInterface, QueryRunner } from 'typeorm';

import {
  poolSeed,
  poolTournamentSeeds,
  poolUserSeeds,
} from '../../seed-data/lib/pools/2026/pool.seed';

export class SeedPool20261770087000000 implements MigrationInterface {
  name = 'SeedPool20261770087000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'INSERT INTO "pool" ("id", "year", "name", "type", "settings", "league_id") VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT ("id") DO NOTHING',
      [
        poolSeed.id,
        poolSeed.year,
        poolSeed.name,
        poolSeed.type,
        poolSeed.settings,
        poolSeed.league_id,
      ]
    );

    const poolTournamentValues = poolTournamentSeeds
      .map((_, index) => {
        const offset = index * 4;
        return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`;
      })
      .join(', ');
    const poolTournamentParams = poolTournamentSeeds.flatMap((seed) => [
      seed.id,
      seed.pool_id,
      seed.league_id,
      seed.pga_tournament_id,
    ]);

    await queryRunner.query(
      `INSERT INTO "pool_tournament" ("id", "pool_id", "league_id", "pga_tournament_id") VALUES ${poolTournamentValues} ON CONFLICT ("id") DO NOTHING`,
      poolTournamentParams
    );

    const poolUserValues = poolUserSeeds
      .map((_, index) => {
        const offset = index * 4;
        return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`;
      })
      .join(', ');
    const poolUserParams = poolUserSeeds.flatMap((seed) => [
      seed.id,
      seed.pool_id,
      seed.league_id,
      seed.user_id,
    ]);

    await queryRunner.query(
      `INSERT INTO "pool_user" ("id", "pool_id", "league_id", "user_id") VALUES ${poolUserValues} ON CONFLICT ("id") DO NOTHING`,
      poolUserParams
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const poolUserIds = poolUserSeeds.map((seed) => seed.id);
    const poolUserPlaceholders = poolUserIds.map((_, index) => `$${index + 1}`).join(', ');

    await queryRunner.query(
      `DELETE FROM "pool_user" WHERE "id" IN (${poolUserPlaceholders})`,
      poolUserIds
    );

    const poolTournamentIds = poolTournamentSeeds.map((seed) => seed.id);
    const poolTournamentPlaceholders = poolTournamentIds
      .map((_, index) => `$${index + 1}`)
      .join(', ');

    await queryRunner.query(
      `DELETE FROM "pool_tournament" WHERE "id" IN (${poolTournamentPlaceholders})`,
      poolTournamentIds
    );

    await queryRunner.query('DELETE FROM "pool" WHERE "id" = $1', [poolSeed.id]);
  }
}
