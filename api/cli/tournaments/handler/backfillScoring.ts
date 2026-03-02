import { PgaTournamentPlayerHoleService } from '../../../src/pga-tournament-player-hole/lib/pga-tournament-player-hole.service';
import { PgaTournamentPlayerService } from '../../../src/pga-tournament-player/lib/pga-tournament-player.service';
import { PgaTournamentStatus } from '../../../src/pga-tournament/lib/pga-tournament.interface';
import { PgaTournamentService } from '../../../src/pga-tournament/lib/pga-tournament.service';
import { PgaPoolCliModule } from '../../cli.module';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

const logger = new Logger('BackfillScoring');

export async function backfillScoring(yearArg: string, tournamentId: string) {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCliModule, {
    logger: ['log', 'warn', 'error'],
  });

  const tournamentService = ctx.get(PgaTournamentService);
  const tournamentPlayerService = ctx.get(PgaTournamentPlayerService);
  const holeService = ctx.get(PgaTournamentPlayerHoleService);

  let tournaments;

  if (tournamentId) {
    const tournament = await tournamentService.get(tournamentId);
    if (!tournament) {
      logger.error(`Tournament not found: ${tournamentId}`);
      await ctx.close();
      return;
    }
    tournaments = [tournament];
  } else {
    const year = yearArg ? Number(yearArg) : new Date().getFullYear();
    logger.log(`Fetching tournaments for year ${year}...`);
    const allTournaments = await tournamentService.listByYear(year);
    tournaments = allTournaments.filter(
      (t) =>
        t.tournament_status === PgaTournamentStatus.COMPLETED ||
        t.tournament_status === PgaTournamentStatus.IN_PROGRESS
    );
    logger.log(
      `Found ${tournaments.length} completed/in-progress tournaments out of ${allTournaments.length} total`
    );
  }

  for (const tournament of tournaments) {
    logger.log(`Backfilling scoring data for ${tournament.name} (${tournament.id})...`);
    try {
      await tournamentPlayerService.ensurePlayersFromField(tournament);
      await holeService.ingestScoringData(tournament);
      logger.log(`Completed: ${tournament.name}`);
    } catch (err) {
      logger.error(`Failed to backfill ${tournament.name} (${tournament.id}): ${err}`);
    }
  }

  logger.log('Backfill complete.');
  await ctx.close();
}
