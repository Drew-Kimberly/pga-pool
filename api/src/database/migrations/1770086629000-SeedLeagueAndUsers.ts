import { MigrationInterface, QueryRunner } from 'typeorm';

import { leagueSeed, leagueUserSeeds, userSeeds } from '../../seed-data/lib/league.seed';

export class SeedLeagueAndUsers1770086629000 implements MigrationInterface {
  name = 'SeedLeagueAndUsers1770086629000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'INSERT INTO "league" ("id", "name") VALUES ($1, $2) ON CONFLICT ("id") DO NOTHING',
      [leagueSeed.id, leagueSeed.name]
    );

    const userValues = userSeeds
      .map((_, index) => {
        const offset = index * 4;
        return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`;
      })
      .join(', ');
    const userParams = userSeeds.flatMap((user) => [
      user.id,
      user.name,
      user.nickname,
      user.is_admin,
    ]);

    await queryRunner.query(
      `INSERT INTO "user" ("id", "name", "nickname", "is_admin") VALUES ${userValues} ON CONFLICT ("id") DO NOTHING`,
      userParams
    );

    const leagueUserValues = leagueUserSeeds
      .map((_, index) => {
        const offset = index * 4;
        return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`;
      })
      .join(', ');
    const leagueUserParams = leagueUserSeeds.flatMap((leagueUser) => [
      leagueUser.id,
      leagueUser.league_id,
      leagueUser.user_id,
      leagueUser.is_owner,
    ]);

    await queryRunner.query(
      `INSERT INTO "league_user" ("id", "league_id", "user_id", "is_owner") VALUES ${leagueUserValues} ON CONFLICT ("id") DO NOTHING`,
      leagueUserParams
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const leagueUserIds = leagueUserSeeds.map((leagueUser) => leagueUser.id);
    const leagueUserPlaceholders = leagueUserIds.map((_, index) => `$${index + 1}`).join(', ');

    await queryRunner.query(
      `DELETE FROM "league_user" WHERE "id" IN (${leagueUserPlaceholders})`,
      leagueUserIds
    );

    const userIds = userSeeds.map((user) => user.id);
    const userPlaceholders = userIds.map((_, index) => `$${index + 1}`).join(', ');

    await queryRunner.query(`DELETE FROM "user" WHERE "id" IN (${userPlaceholders})`, userIds);

    await queryRunner.query('DELETE FROM "league" WHERE "id" = $1', [leagueSeed.id]);
  }
}
