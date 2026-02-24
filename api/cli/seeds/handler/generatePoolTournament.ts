import fs from 'fs';
import path from 'path';

import { In } from 'typeorm';

import { PgaTournament } from '../../../src/pga-tournament/lib/pga-tournament.entity';
import { PoolTournament } from '../../../src/pool-tournament/lib/pool-tournament.entity';
import { PoolTournamentPlayer } from '../../../src/pool-tournament-player/lib/pool-tournament-player.entity';
import { PoolTournamentUser } from '../../../src/pool-tournament-user/lib/pool-tournament-user.entity';
import { PoolTournamentUserPick } from '../../../src/pool-tournament-user-pick/lib/pool-tournament-user-pick.entity';
import { PoolUser } from '../../../src/pool-user/lib/pool-user.entity';
import { SeedDataService } from '../../../src/seed-data/lib/seed-data.service';
import { PgaPoolCliModule } from '../../cli.module';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getDataSourceToken } from '@nestjs/typeorm';

type PicksSeed = {
  league_id: string;
  pool_id: string;
  pga_tournament_id: string;
  picks: Record<string, number[]>;
};

export async function generatePoolTournament(tournamentId: string) {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCliModule, {
    logger: ['log', 'warn', 'error'],
  });
  const seedDataService = ctx.get(SeedDataService);
  const logger = new Logger(generatePoolTournament.name);
  const db = ctx.get(getDataSourceToken());

  const picksPath = path.join(seedDataService.getSeedDirPath(), tournamentId, 'picks.json');

  if (!fs.existsSync(picksPath)) {
    throw new Error(`Missing picks.json at ${picksPath}`);
  }

  const picks = JSON.parse(fs.readFileSync(picksPath, 'utf8')) as PicksSeed;

  if (picks.pga_tournament_id !== tournamentId) {
    throw new Error(
      `picks.json pga_tournament_id (${picks.pga_tournament_id}) does not match ${tournamentId}`
    );
  }

  const pickEntries = Object.entries(picks.picks ?? {});
  for (const [userId, pickList] of pickEntries) {
    if (!Array.isArray(pickList) || pickList.length !== 4) {
      throw new Error(`Invalid picks for user ${userId}: expected array length 4`);
    }
    if (!pickList.every((value) => Number.isInteger(value))) {
      throw new Error(`Invalid picks for user ${userId}: picks must be integers`);
    }
  }

  await db.transaction('READ COMMITTED', async (txManager) => {
    const pgaTournamentRepo = txManager.getRepository(PgaTournament);
    const poolTournamentRepo = txManager.getRepository(PoolTournament);
    const poolTournamentPlayerRepo = txManager.getRepository(PoolTournamentPlayer);
    const poolTournamentUserRepo = txManager.getRepository(PoolTournamentUser);
    const poolTournamentUserPickRepo = txManager.getRepository(PoolTournamentUserPick);
    const poolUserRepo = txManager.getRepository(PoolUser);

    const pgaTournament = await pgaTournamentRepo.findOneBy({ id: tournamentId });
    if (!pgaTournament) {
      throw new Error(`PGA tournament ${tournamentId} does not exist`);
    }

    const poolUsers = await poolUserRepo.findBy({
      pool_id: picks.pool_id,
      league_id: picks.league_id,
    });
    const poolUserByUserId = new Map(poolUsers.map((poolUser) => [poolUser.user_id, poolUser]));

    let poolTournament = await poolTournamentRepo.findOneBy({ pga_tournament_id: tournamentId });
    if (!poolTournament) {
      poolTournament = await poolTournamentRepo.save({
        pool_id: picks.pool_id,
        league_id: picks.league_id,
        pga_tournament_id: tournamentId,
      });
      logger.log(`Created pool_tournament ${poolTournament.id}`);
    } else {
      if (
        poolTournament.pool_id !== picks.pool_id ||
        poolTournament.league_id !== picks.league_id
      ) {
        throw new Error(
          `Pool tournament ${poolTournament.id} exists but pool/league do not match picks.json`
        );
      }
    }

    const poolTournamentPlayers = await poolTournamentPlayerRepo.find({
      where: { pool_tournament: { id: poolTournament.id } },
      relations: ['pga_tournament_player', 'pga_tournament_player.pga_player'],
    });
    const poolTournamentPlayerByPlayerId = new Map(
      poolTournamentPlayers.map((player) => [player.pga_tournament_player.pga_player.id, player])
    );

    const existingPoolTournamentUsers = await poolTournamentUserRepo.find({
      where: { pool_tournament: { id: poolTournament.id } },
    });
    const poolTournamentUserByPoolUserId = new Map(
      existingPoolTournamentUsers.map((user) => [user.pool_user_id, user])
    );

    const poolTournamentUsersToSave: PoolTournamentUser[] = [];
    for (const poolUser of poolUsers) {
      if (!poolTournamentUserByPoolUserId.has(poolUser.id)) {
        poolTournamentUsersToSave.push(
          poolTournamentUserRepo.create({
            pool_tournament: poolTournament,
            pool_tournament_id: poolTournament.id,
            pool_user_id: poolUser.id,
            league_id: picks.league_id,
          })
        );
      }
    }
    if (poolTournamentUsersToSave.length > 0) {
      const saved = await poolTournamentUserRepo.save(poolTournamentUsersToSave);
      for (const user of saved) {
        poolTournamentUserByPoolUserId.set(user.pool_user_id, user);
      }
    }

    const poolTournamentUserIds = [...poolTournamentUserByPoolUserId.values()].map((u) => u.id);
    const existingPicks =
      poolTournamentUserIds.length === 0
        ? []
        : await poolTournamentUserPickRepo.find({
            where: { pool_tournamnet_user_id: In(poolTournamentUserIds) },
          });

    const existingPickKey = new Set(
      existingPicks.map(
        (pick) => `${pick.pool_tournamnet_user_id}:${pick.pool_tournament_player_id}`
      )
    );

    const poolTournamentUserPickToSave: PoolTournamentUserPick[] = [];
    for (const [userId, userPicks] of pickEntries) {
      const poolUser = poolUserByUserId.get(userId);
      if (!poolUser) {
        logger.warn(`Skipping picks for unknown user_id ${userId}`);
        continue;
      }

      const poolTournamentUser = poolTournamentUserByPoolUserId.get(poolUser.id);
      if (!poolTournamentUser) {
        logger.warn(`Skipping picks for user_id ${userId}: missing pool_tournament_user`);
        continue;
      }

      userPicks.forEach((playerId, idx) => {
        if (!playerId || playerId === 0) {
          return;
        }

        const poolTournamentPlayer = poolTournamentPlayerByPlayerId.get(playerId);
        if (!poolTournamentPlayer) {
          logger.warn(
            `Skipping pick for user_id ${userId} (tier ${
              idx + 1
            }): player_id ${playerId} not in field`
          );
          return;
        }

        const key = `${poolTournamentUser.id}:${poolTournamentPlayer.id}`;
        if (existingPickKey.has(key)) {
          return;
        }

        poolTournamentUserPickToSave.push(
          poolTournamentUserPickRepo.create({
            pool_tournamnet_user_id: poolTournamentUser.id,
            pool_tournament_player_id: poolTournamentPlayer.id,
          })
        );
        existingPickKey.add(key);
      });
    }

    if (poolTournamentUserPickToSave.length > 0) {
      await poolTournamentUserPickRepo.save(poolTournamentUserPickToSave);
    }
  });

  await ctx.close();
}
