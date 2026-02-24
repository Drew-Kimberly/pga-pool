import fs from 'fs';
import readline from 'readline';

import { In } from 'typeorm';

import { tournamentMap } from '../../../src/metabet-api/lib/metabet-api.constants';
import { OddsLocation, OddsProvider } from '../../../src/metabet-api/lib/metabet-api.interface';
import { MetabetApiService } from '../../../src/metabet-api/lib/metabet-api.service';
import { PgaPlayerService } from '../../../src/pga-player/lib/pga-player.service';
import { PgaTourApiService } from '../../../src/pga-tour-api/lib/v2/pga-tour-api.service';
import { PgaTournamentService } from '../../../src/pga-tournament/lib/pga-tournament.service';
import { PgaTournamentField } from '../../../src/pga-tournament-field/lib/pga-tournament-field.interface';
import { PgaTournamentPlayer } from '../../../src/pga-tournament-player/lib/pga-tournament-player.entity';
import { PlayerStatus } from '../../../src/pga-tournament-player/lib/pga-tournament-player.interface';
import { PoolTournamentPlayer } from '../../../src/pool-tournament-player/lib/pool-tournament-player.entity';
import { PoolTournamentService } from '../../../src/pool-tournament/lib/pool-tournament.service';
import { SeedDataService } from '../../../src/seed-data/lib/seed-data.service';
import { PgaPoolCliModule } from '../../cli.module';
import { Maths, outputJson } from '../../utils';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getDataSourceToken } from '@nestjs/typeorm';

export async function generateTournamentField(pgaTournamentId: string, tierCutoffs?: number[]) {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCliModule, {
    logger: ['log', 'warn', 'error'],
  });
  const pgaTourApi = ctx.get(PgaTourApiService);
  const pgaTourneyService = ctx.get(PgaTournamentService);
  const pgaPlayerService = ctx.get(PgaPlayerService);
  const metabetApiService = ctx.get(MetabetApiService);
  const seedDataService = ctx.get(SeedDataService);

  const logger = new Logger(generateTournamentField.name);

  const pgaTournament = await pgaTourneyService.get(pgaTournamentId);
  if (!pgaTournament) {
    throw new Error(`No PGA Tournament (ID: ${pgaTournamentId}) found!`);
  }

  const playersNotFound: { name: string; odds: number; tier: number }[] = [];
  const field: PgaTournamentField = {
    pga_tournament_id: pgaTournament.id,
    created_at: Math.floor(Date.now() / 1000),
    player_tiers: {},
  };

  if (pgaTournamentId === 'R2025016' && tierCutoffs) {
    const { leaderboard } = await pgaTourApi.getTournamentLeaderboard(2025, '016');

    // [pid, odds, playerName]
    const tournamentOdds: [string, number, string][] = leaderboard.players
      .filter((p) => !!p.scoringData.oddsToWin)
      .map((p) => [p.id, fromOddsString(p.scoringData.oddsToWin), p.player.displayName]);
    tournamentOdds.sort((a, b) => (a[1] <= b[1] ? -1 : 1));

    const pgaPlayers = Object.fromEntries((await pgaPlayerService.list()).map((p) => [p.id, p]));

    let oddsIdx = 0;
    for (let tier = 1; tier <= tierCutoffs.length + 1; tier++) {
      const cutoff = tierCutoffs[tier - 1] ?? Number.MAX_SAFE_INTEGER;
      field.player_tiers[tier] = {};

      while (tournamentOdds[oddsIdx] && tournamentOdds[oddsIdx][1] <= cutoff) {
        const pgaPlayer = pgaPlayers[tournamentOdds[oddsIdx][0]];
        if (!pgaPlayer) {
          playersNotFound.push({
            name: tournamentOdds[oddsIdx][2],
            odds: tournamentOdds[oddsIdx][1],
            tier,
          });

          oddsIdx++;
          continue;
        }

        field.player_tiers[tier][pgaPlayer.id] = {
          name: pgaPlayer.name,
          odds: toOddsString(tournamentOdds[oddsIdx][1]),
        };

        oddsIdx++;
      }
    }
  } else {
    // Debug metabet tourney names
    // await metabetApiService.getOdds(OddsLocation.NewYork, OddsProvider.Consensus).then((odds) => {
    //   odds.forEach((o) => console.log(o.tournamentName));
    // });

    const tournamentOdds = (await metabetApiService.getOdds(OddsLocation.NewYork, OddsProvider.MGM))
      .reverse()
      .find(
        (o) =>
          [pgaTournament.name.toLowerCase(), tournamentMap[pgaTournament.name.toLowerCase()]]
            .filter(Boolean)
            .includes(o.tournamentName.toLowerCase()) && pgaTournament.year === o.year
      );

    if (!tournamentOdds) {
      throw new Error(
        `No tournament odds found for ${pgaTournament.year} ${pgaTournament.name} (ID: ${pgaTournament.id})`
      );
    }

    tournamentOdds.players.sort((a, b) => (a.odds <= b.odds ? -1 : 1));

    const pgaPlayers = Object.fromEntries((await pgaPlayerService.list()).map((p) => [p.name, p]));

    if (Array.isArray(tierCutoffs)) {
      let oddsIdx = 0;
      for (let tier = 1; tier <= tierCutoffs.length + 1; tier++) {
        const cutoff = tierCutoffs[tier - 1] ?? Number.MAX_SAFE_INTEGER;
        field.player_tiers[tier] = {};

        while (tournamentOdds.players[oddsIdx] && tournamentOdds.players[oddsIdx].odds <= cutoff) {
          const pgaPlayer = pgaPlayers[tournamentOdds.players[oddsIdx].name];
          if (!pgaPlayer) {
            playersNotFound.push({
              name: tournamentOdds.players[oddsIdx].name,
              odds: tournamentOdds.players[oddsIdx].odds,
              tier,
            });

            oddsIdx++;
            continue;
          }

          field.player_tiers[tier][pgaPlayer.id] = {
            name: pgaPlayer.name,
            odds: toOddsString(tournamentOdds.players[oddsIdx].odds),
          };

          oddsIdx++;
        }
      }
    } else {
      const odds = tournamentOdds.players.map((p) => p.odds);
      const zScores = Maths.zScores(...odds);

      const cutoffs = [-0.75, -0.65, -0.45];
      tournamentOdds.players.forEach((p, i) => {
        console.log(p.name, p.odds, zScores[i]);
      });

      let idx = 0;
      for (let tier = 1; tier <= 4; tier++) {
        const cutoff = cutoffs[tier - 1] ?? Number.MAX_SAFE_INTEGER;
        field.player_tiers[tier] = {};

        while (tournamentOdds.players[idx] && zScores[idx] <= cutoff) {
          const pgaPlayer = pgaPlayers[tournamentOdds.players[idx].name];
          if (!pgaPlayer) {
            playersNotFound.push({
              name: tournamentOdds.players[idx].name,
              odds: tournamentOdds.players[idx].odds,
              tier,
            });

            idx++;
            continue;
          }

          field.player_tiers[tier][pgaPlayer.id] = {
            name: pgaPlayer.name,
            odds: toOddsString(tournamentOdds.players[idx].odds),
          };

          idx++;
        }
      }
    }
  }

  outputJson(field);

  playersNotFound.forEach((p) => {
    logger.warn(`No PGA Player found for ${p.name} ${toOddsString(p.odds)} (Tier ${p.tier})`);
  });

  Object.entries(field.player_tiers).forEach(([tier, player]) => {
    const entries = Object.entries(player);
    entries.sort((a, b) => (fromOddsString(a[1].odds) <= fromOddsString(b[1].odds) ? -1 : 1));
    for (let i = 0; i < 3; i++) {
      if (i in entries) {
        logger.log(`${entries[i][1].name} ${entries[i][1].odds} Tier ${tier}`);
      }
    }
  });

  const seedDir = `${seedDataService.getSeedDirPath()}/${pgaTournament.id}`;
  fs.mkdirSync(seedDir, { recursive: true });
  fs.writeFileSync(`${seedDir}/field.json`, JSON.stringify(field, null, 4));
  logger.log(`Wrote field seed to ${seedDir}/field.json`);

  const confirmed = await promptConfirm('\nSeed pool tournament players to the database?');
  if (!confirmed) {
    logger.log('Skipped database seeding.');
    await ctx.close();
    return;
  }

  await seedPoolTournamentPlayers(ctx, field, logger);

  await ctx.close();
}

function promptConfirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(`${question} (y/N) `, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === 'y');
    });
  });
}

async function seedPoolTournamentPlayers(
  ctx: Awaited<ReturnType<typeof NestFactory.createApplicationContext>>,
  field: PgaTournamentField,
  logger: Logger
) {
  const poolTournamentService = ctx.get(PoolTournamentService);
  const db = ctx.get(getDataSourceToken());

  const poolTournaments = await poolTournamentService.listByPgaTournamentId(
    field.pga_tournament_id
  );
  if (poolTournaments.length === 0) {
    logger.warn(
      `No pool tournaments found for PGA Tournament ${field.pga_tournament_id}. Skipping pool tournament player creation.`
    );
    return;
  }

  const tierEntries = Object.entries(field.player_tiers);
  const fieldPlayerIds = [
    ...new Set(tierEntries.flatMap(([, players]) => Object.keys(players).map(Number))),
  ];

  if (fieldPlayerIds.length === 0) {
    logger.warn('No players in field. Skipping pool tournament player creation.');
    return;
  }

  await db.transaction('READ COMMITTED', async (txManager) => {
    const pgaTournamentPlayerRepo = txManager.getRepository(PgaTournamentPlayer);
    const poolTournamentPlayerRepo = txManager.getRepository(PoolTournamentPlayer);

    // Ensure pga_tournament_player rows exist for all field players
    const existingTournamentPlayers = await pgaTournamentPlayerRepo.find({
      where: {
        pga_tournament: { id: field.pga_tournament_id },
        pga_player: { id: In(fieldPlayerIds) },
      },
      relations: ['pga_player', 'pga_tournament'],
    });
    const existingPlayerIdSet = new Set(
      existingTournamentPlayers.map((p) => p.pga_player.id)
    );

    const missingPlayerIds = fieldPlayerIds.filter((id) => !existingPlayerIdSet.has(id));
    if (missingPlayerIds.length > 0) {
      const stubs = missingPlayerIds.map((playerId) => ({
        id: `${playerId}-${field.pga_tournament_id}`,
        pga_player: { id: playerId },
        pga_tournament: { id: field.pga_tournament_id },
        active: true,
        status: PlayerStatus.Active,
        is_round_complete: false,
        current_round: null,
        current_hole: null,
        starting_hole: 1,
        tee_time: null,
        score_total: 0,
        score_thru: null,
        current_position: null,
        projected_fedex_cup_points: 0,
        official_fedex_cup_points: null,
      }));

      await pgaTournamentPlayerRepo.upsert(stubs, ['id']);
      logger.log(`Created ${stubs.length} stub pga_tournament_player rows`);
    }

    // Re-fetch all tournament players so we have full entities
    const allTournamentPlayers = await pgaTournamentPlayerRepo.find({
      where: {
        pga_tournament: { id: field.pga_tournament_id },
        pga_player: { id: In(fieldPlayerIds) },
      },
      relations: ['pga_player', 'pga_tournament'],
    });
    const tournamentPlayerByPlayerId = new Map(
      allTournamentPlayers.map((p) => [p.pga_player.id, p])
    );

    for (const poolTournament of poolTournaments) {
      const existingPoolPlayers = await poolTournamentPlayerRepo.find({
        where: { pool_tournament: { id: poolTournament.id } },
        relations: ['pga_tournament_player'],
      });
      const existingByTourneyPlayerId = new Map(
        existingPoolPlayers.map((p) => [p.pga_tournament_player.id, p])
      );

      const toSave: PoolTournamentPlayer[] = [];
      for (const [tierStr, tierPlayers] of tierEntries) {
        const tier = Number(tierStr);
        for (const playerIdStr of Object.keys(tierPlayers)) {
          const tournamentPlayer = tournamentPlayerByPlayerId.get(Number(playerIdStr));
          if (!tournamentPlayer) {
            continue;
          }

          const existing = existingByTourneyPlayerId.get(tournamentPlayer.id);
          if (existing) {
            if (existing.tier !== tier) {
              toSave.push({ ...existing, tier });
            }
          } else {
            toSave.push(
              poolTournamentPlayerRepo.create({
                tier,
                pga_tournament_player: tournamentPlayer,
                pool_tournament: poolTournament,
              })
            );
          }
        }
      }

      if (toSave.length > 0) {
        await poolTournamentPlayerRepo.save(toSave);
      }

      logger.log(
        `Pool tournament ${poolTournament.id}: ${toSave.length} pool_tournament_player rows saved`
      );
    }
  });
}

function toOddsString(odds: number) {
  return odds < 0 ? odds.toString() : `+${odds}`;
}

function fromOddsString(odds: string) {
  return Number(odds.startsWith('+') ? odds.substring(1) : odds);
}
