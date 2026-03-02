import fs from 'fs';
import path from 'path';

import { PgaTournamentField } from '../../../src/pga-tournament-field/lib/pga-tournament-field.interface';
import { PoolTournament } from '../../../src/pool-tournament/lib/pool-tournament.entity';
import { PoolTournamentService } from '../../../src/pool-tournament/lib/pool-tournament.service';
import { PoolTournamentPlayer } from '../../../src/pool-tournament-player/lib/pool-tournament-player.entity';
import { SeedDataService } from '../../../src/seed-data/lib/seed-data.service';
import { PgaPoolCliModule } from '../../cli.module';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getDataSourceToken } from '@nestjs/typeorm';

export async function backfillOdds(year?: number) {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCliModule, {
    logger: ['log', 'warn', 'error'],
  });
  const seedDataService = ctx.get(SeedDataService);
  const poolTournamentService = ctx.get(PoolTournamentService);
  const db = ctx.get(getDataSourceToken());
  const logger = new Logger(backfillOdds.name);

  const seedDir = seedDataService.getSeedDirPath();
  const tournamentDirs = fs.readdirSync(seedDir).filter((entry) => {
    const fullPath = path.join(seedDir, entry);
    return fs.lstatSync(fullPath).isDirectory() && fs.existsSync(path.join(fullPath, 'field.json'));
  });

  logger.log(
    `Found ${tournamentDirs.length} seed directories with field.json${year ? ` (filtering to year ${year})` : ''}`
  );

  let totalUpdated = 0;
  let tournamentsProcessed = 0;

  for (const tournamentDir of tournamentDirs) {
    const fieldPath = path.join(seedDir, tournamentDir, 'field.json');
    const field: PgaTournamentField = JSON.parse(fs.readFileSync(fieldPath, 'utf8'));

    if (year !== undefined && !field.pga_tournament_id.includes(String(year))) {
      continue;
    }

    const poolTournaments = await poolTournamentService.listByPgaTournamentId(
      field.pga_tournament_id
    );

    if (poolTournaments.length === 0) {
      logger.debug?.(`No pool tournaments for ${field.pga_tournament_id}, skipping`);
      continue;
    }

    // Build a map of playerId -> odds from the seed data
    const oddsMap = new Map<number, string>();
    for (const [, players] of Object.entries(field.player_tiers)) {
      for (const [playerIdStr, playerData] of Object.entries(players)) {
        oddsMap.set(Number(playerIdStr), playerData.odds);
      }
    }

    await db.transaction('READ COMMITTED', async (txManager) => {
      const poolTournamentPlayerRepo = txManager.getRepository(PoolTournamentPlayer);
      const poolTournamentRepo = txManager.getRepository(PoolTournament);

      for (const poolTournament of poolTournaments) {
        const poolPlayers = await poolTournamentPlayerRepo.find({
          where: { pool_tournament: { id: poolTournament.id } },
          relations: ['pga_tournament_player', 'pga_tournament_player.pga_player'],
        });

        let updated = 0;
        for (const poolPlayer of poolPlayers) {
          const odds = oddsMap.get(poolPlayer.pga_tournament_player.pga_player.id);
          if (odds && poolPlayer.odds !== odds) {
            await poolTournamentPlayerRepo.update(poolPlayer.id, { odds });
            updated++;
          }
        }

        // Set field_published_at from seed created_at
        if (field.created_at && !poolTournament.field_published_at) {
          await poolTournamentRepo.update(poolTournament.id, {
            field_published_at: new Date(field.created_at * 1000),
          });
        }

        totalUpdated += updated;
        logger.log(
          `${field.pga_tournament_id} pool ${poolTournament.id}: updated ${updated} player odds`
        );
      }
    });

    tournamentsProcessed++;
  }

  logger.log(
    `Backfill complete: ${tournamentsProcessed} tournaments processed, ${totalUpdated} player odds updated`
  );

  await ctx.close();
}
