import { PgaTournament } from '../../../src/pga-tournament/lib/pga-tournament.entity';
import { PgaTournamentStatus } from '../../../src/pga-tournament/lib/pga-tournament.interface';
import { PgaTournamentService } from '../../../src/pga-tournament/lib/pga-tournament.service';
import { OfficialPointsResyncService } from '../../../src/pool-tournament/lib/official-points-resync.service';
import { PgaPoolCliModule } from '../../cli.module';
import { outputJson } from '../../utils';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

const logger = new Logger('ResyncOfficialPoints');

export async function resyncOfficialPoints(tournamentId: string, yearArg: string, dryRun: boolean) {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCliModule, {
    logger: ['log', 'warn', 'error'],
  });

  const tournamentService = ctx.get(PgaTournamentService);
  const resyncService = ctx.get(OfficialPointsResyncService);

  let tournaments: PgaTournament[];

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
      (t) => t.tournament_status === PgaTournamentStatus.COMPLETED && t.fedex_cup_event
    );
    logger.log(
      `Found ${tournaments.length} completed FedEx Cup tournaments out of ${allTournaments.length} total`
    );
  }

  for (const tournament of tournaments) {
    logger.log(
      `Resyncing official FedEx Cup points for ${tournament.name} (${tournament.id})` +
        `${dryRun ? ' [dry run]' : ''}...`
    );
    try {
      const result = await resyncService.resync(tournament.id, { dryRun });
      if (result.playerCorrections.length === 0) {
        logger.log(`No corrections needed for ${tournament.name}`);
        continue;
      }
      outputJson(result);
    } catch (err) {
      logger.error(`Failed to resync ${tournament.name} (${tournament.id}): ${err}`);
    }
  }

  logger.log('Resync complete.');
  await ctx.close();
}
