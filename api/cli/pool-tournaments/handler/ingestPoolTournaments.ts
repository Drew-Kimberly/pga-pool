import { PgaPlayer } from '../../../src/pga-player/lib/pga-player.entity';
import { PgaTournament } from '../../../src/pga-tournament/lib/pga-tournament.entity';
import { PgaTournamentService } from '../../../src/pga-tournament/lib/pga-tournament.service';
import { PgaTournamentField } from '../../../src/pga-tournament-field/lib/pga-tournament-field.interface';
import { PgaTournamentPlayer } from '../../../src/pga-tournament-player/lib/pga-tournament-player.entity';
import { PlayerStatus } from '../../../src/pga-tournament-player/lib/pga-tournament-player.interface';
import { PgaTournamentPlayerService } from '../../../src/pga-tournament-player/lib/pga-tournament-player.service';
import { PoolTournament } from '../../../src/pool-tournament/lib/pool-tournament.entity';
import { PoolTournamentService } from '../../../src/pool-tournament/lib/pool-tournament.service';
import { PoolTournamentPlayer } from '../../../src/pool-tournament-player/lib/pool-tournament-player.entity';
import { PoolTournamentPlayerService } from '../../../src/pool-tournament-player/lib/pool-tournament-player.service';
import { PoolUser } from '../../../src/pool-user/lib/pool-user.entity';
import { PoolUserService } from '../../../src/pool-user/lib/pool-user.service';
import { PoolUserPick } from '../../../src/pool-user-pick/lib/pool-user-pick.entity';
import { PoolUserPickService } from '../../../src/pool-user-pick/lib/pool-user-pick.service';
import { SeedDataService } from '../../../src/seed-data/lib/seed-data.service';
import { User } from '../../../src/user/lib/user.entity';
import { PgaPoolCliModule } from '../../cli.module';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getDataSourceToken } from '@nestjs/typeorm';

interface PoolTournamentSeed {
  pgaTournamentId: string;
  players: Record<string, { tier: string }>;
  picks: Record<string, [number, number, number, number]>;
}

export async function ingestPoolTournaments(year?: string, pgaTournamentId?: string) {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCliModule, {
    logger: ['log', 'warn', 'error'],
  });
  const poolTournamentService = ctx.get(PoolTournamentService);
  const poolTournamentPlayerService = ctx.get(PoolTournamentPlayerService);
  const poolUserService = ctx.get(PoolUserService);
  const poolUserPickService = ctx.get(PoolUserPickService);
  const pgaTournamentService = ctx.get(PgaTournamentService);
  const pgaTournamentPlayerService = ctx.get(PgaTournamentPlayerService);
  const seedDataService = ctx.get(SeedDataService);
  const db = ctx.get(getDataSourceToken());
  const logger = new Logger(ingestPoolTournaments.name);

  const seedTournaments = getSeedTournaments(seedDataService, year, pgaTournamentId);

  if (seedTournaments.length === 0) {
    logger.warn(`No pool tournaments to ingest!`);
    await ctx.close();
  }

  for (const seedTournament of seedTournaments) {
    const pgaTournament = await pgaTournamentService.get(seedTournament.pgaTournamentId);
    if (!pgaTournament) {
      throw new Error(`No PGA Tournament found with ID ${seedTournament.pgaTournamentId}`);
    }

    const existingPoolTournament = (
      await poolTournamentService.list({
        pgaTournamentId: pgaTournament.id,
      })
    )[0];

    await db.manager.transaction('READ COMMITTED', async (txManager) => {
      // Create the pool tournament
      const poolTournament = await poolTournamentService.upsert(
        {
          id: existingPoolTournament?.id,
          active: existingPoolTournament?.active ?? true,
          pga_tournament: { id: pgaTournament.id } as PgaTournament,
          pool_users: existingPoolTournament?.pool_users ?? [],
        },
        txManager.getRepository(PoolTournament)
      );

      logger.log(
        `Ingested pool tournament ${poolTournament.id} associated to PGA tournament ${pgaTournament.name} ${pgaTournament.year} (${pgaTournament.id})`
      );

      // Create the tournament field
      const existingPgaTourneyPlayers = await pgaTournamentPlayerService.list(
        {
          tournamentId: pgaTournament.id,
        },
        txManager.getRepository(PgaTournamentPlayer)
      );
      const existingPoolTourneyPlayers = await poolTournamentPlayerService.list(
        {
          pgaTournamentId: pgaTournament.id,
        },
        txManager.getRepository(PoolTournamentPlayer)
      );

      for (const [playerId, { tier }] of Object.entries(seedTournament.players)) {
        const existingPgaTourneyPlayer = existingPgaTourneyPlayers.find((p) => p.id === playerId);
        const pgaTourneyPlayer = await pgaTournamentPlayerService.upsert(
          {
            id: `${playerId}-${pgaTournament.id}`,
            active: existingPgaTourneyPlayer?.active ?? true,
            current_hole: existingPgaTourneyPlayer?.current_hole ?? null,
            current_position: existingPgaTourneyPlayer?.current_position ?? null,
            current_round: existingPgaTourneyPlayer?.current_round ?? null,
            is_round_complete: existingPgaTourneyPlayer?.is_round_complete ?? false,
            pga_player: { id: Number(playerId) } as PgaPlayer,
            pga_tournament: { id: pgaTournament.id } as PgaTournament,
            score_thru: existingPgaTourneyPlayer?.score_thru ?? null,
            score_total: existingPgaTourneyPlayer?.score_total ?? null,
            starting_hole: existingPgaTourneyPlayer?.starting_hole ?? 1,
            status: existingPgaTourneyPlayer?.status ?? PlayerStatus.Active,
            tee_time: existingPgaTourneyPlayer?.tee_time ?? null,
            projected_fedex_cup_points: existingPgaTourneyPlayer?.projected_fedex_cup_points ?? 0,
          },
          txManager.getRepository(PgaTournamentPlayer)
        );

        const existingPoolTourneyPlayer = existingPoolTourneyPlayers.find(
          (p) =>
            p.pga_tournament_player.id === pgaTourneyPlayer.id &&
            p.pool_tournament.id === poolTournament.id
        );
        const poolTourneyPlayer = await poolTournamentPlayerService.upsert(
          {
            id: existingPoolTourneyPlayer?.id as string,
            pga_tournament_player: { id: pgaTourneyPlayer.id } as PgaTournamentPlayer,
            pool_tournament: { id: poolTournament.id } as PoolTournament,
            tier: existingPoolTourneyPlayer?.tier ?? Number(tier),
          },
          txManager.getRepository(PoolTournamentPlayer)
        );

        logger.log(
          `Ingested ${pgaTournament.name} ${pgaTournament.year} player ${pgaTourneyPlayer.pga_player.id} at Tier ${poolTourneyPlayer.tier}`
        );
      }

      // Ingest pool users / picks
      const existingPoolUsers = await poolUserService.list(
        { poolTournamentId: poolTournament.id },
        txManager.getRepository(PoolUser)
      );
      const poolTourneyPlayers = await poolTournamentPlayerService.list(
        {
          poolTournamentId: poolTournament.id,
        },
        txManager.getRepository(PoolTournamentPlayer)
      );
      for (const [userId, picks] of Object.entries(seedTournament.picks)) {
        const existingPoolUser = existingPoolUsers.find((u) => u.user.id === userId);
        const poolUser = await poolUserService.upsert(
          {
            id: existingPoolUser?.id as string,
            pool_tournament: { id: poolTournament.id } as PoolTournament,
            score: existingPoolUser?.score ?? null,
            projected_fedex_cup_points: existingPoolUser?.projected_fedex_cup_points ?? 0,
            picks: existingPoolUser?.picks ?? [],
            user: { id: userId } as User,
          },
          txManager.getRepository(PoolUser)
        );

        const existingPicks = await poolUserPickService.list(
          { poolUserId: poolUser.id },
          txManager.getRepository(PoolUserPick)
        );
        for (const pick of picks) {
          const existingPick = existingPicks.find(
            (p) => p.pool_tournament_player.pga_tournament_player.pga_player.id === pick
          );
          await poolUserPickService.upsert(
            {
              id: existingPick?.id as string,
              pool_tournament_player: {
                id: poolTourneyPlayers.find((p) => p.pga_tournament_player.pga_player.id === pick)
                  ?.id as string,
              } as PoolTournamentPlayer,
              pool_user: { id: poolUser.id } as PoolUser,
            },
            txManager.getRepository(PoolUserPick)
          );
        }

        logger.log(`Ingested ${userId} picks for ${pgaTournament.name} ${pgaTournament.year}`);
      }
    });
  }

  await ctx.close();
}

function getSeedTournaments(
  seedDataService: SeedDataService,
  year?: string,
  pgaTournamentId?: string
): PoolTournamentSeed[] {
  const allSeeds = seedDataService.getAllSeedData();
  let tournamentSeedIds = Object.keys(allSeeds).filter((name) => name.match(/\d\d\d-\d\d\d\d/g));

  if (year) {
    tournamentSeedIds = tournamentSeedIds.filter((id) => id.endsWith(year));
  }

  if (pgaTournamentId) {
    tournamentSeedIds = tournamentSeedIds.filter((id) => id === pgaTournamentId);
  }

  return tournamentSeedIds.map((id) => {
    const data = seedDataService.getSeedData<{
      field: PgaTournamentField;
      picks: { tournament_id: string; picks: Record<string, [number, number, number, number]> };
    }>(id);

    if (!data) {
      throw new Error(`No seed data found at: ${id}`);
    }

    const { field, picks } = data;

    if (!field) {
      throw new Error(`Missing field.json seed for tournament ${id}`);
    }

    if (!picks) {
      throw new Error(`Missing picks.json seed for tournament ${id}`);
    }

    const players: PoolTournamentSeed['players'] = {};

    for (const tier of Object.keys(field.player_tiers)) {
      Object.keys(field.player_tiers[tier]).forEach((playerId) => (players[playerId] = { tier }));
    }

    return {
      pgaTournamentId: id,
      picks: picks.picks,
      players,
    };
  });
}
