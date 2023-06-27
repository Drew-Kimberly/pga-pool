import { PgaApiTourTournament } from '../../../src/pga-tour-api/lib/v2/pga-tour-api.interface';
import { PgaTourApiService } from '../../../src/pga-tour-api/lib/v2/pga-tour-api.service';
import { PgaTournamentFormat } from '../../../src/pga-tournament/lib/pga-tournament.interface';
import { PgaTournamentService } from '../../../src/pga-tournament/lib/pga-tournament.service';
import { PgaPoolCliModule } from '../../cli.module';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

const BATCH_SIZE = 25;

export async function ingestTournaments() {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCliModule, {
    logger: ['log', 'warn', 'error'],
  });
  const pgaTourApi = ctx.get(PgaTourApiService);
  const pgaTournamentService = ctx.get(PgaTournamentService);
  const logger = new Logger(ingestTournaments.name);

  const tournamentsResponse = await pgaTourApi.getTournamentSchedule();
  const tournaments: PgaApiTourTournament[] = [];

  for (const tourneyYear of tournamentsResponse.years) {
    const pgaTourTourneys = tourneyYear.tours.find((tour) => tour.desc === 'PGA TOUR');
    if (!pgaTourTourneys) {
      logger.warn(`No PGA Tour tournaments found for year: ${tourneyYear.year}`);
      continue;
    }

    for (const tourney of pgaTourTourneys.trns) {
      if (tourney.format && tourney.FedExCup === 'Yes') {
        tournaments.push(tourney);
      }
    }
  }

  logger.log(`Ingesting ${tournaments.length} PGA Tour tournaments`);

  // @note - idempotent operation here so not worried about a DB tx
  for (let i = 0; i < tournaments.length; i += BATCH_SIZE) {
    const batch = tournaments.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map((tourney) =>
        pgaTournamentService.upsert({
          id: `${tourney.permNum}-${tourney.year}`,
          tournament_id: tourney.permNum,
          full_name: tourney.trnName.long,
          short_name: tourney.trnName.short,
          year: Number(tourney.year),
          time_zone: tourney.timeZone,
          week_number: Number(tourney.date.weekNumber),
          start_date: tourney.date.start,
          end_date: tourney.date.end,
          format: convertTournamentFormat(tourney.format),
          fedex_cup_purse: numStringToNum(tourney.FedExCupPurse),
          fedex_cup_winner_points: numStringToNum(tourney.FedExCupWinnerPoints),
        })
      )
    );
  }

  await ctx.close();
}

function convertTournamentFormat(format: PgaApiTourTournament['format']): PgaTournamentFormat {
  if (format === '') {
    throw new Error('Unexpected empty tournament format');
  }

  const map = {
    stroke: PgaTournamentFormat.Stroke,
    Team: PgaTournamentFormat.Team,
    match: PgaTournamentFormat.Match,
    'team match': PgaTournamentFormat.TeamMatch,
    Stableford: PgaTournamentFormat.Stableford,
  };

  return map[format];
}

function numStringToNum(numString: string): number {
  const stripped = numString.replace(',', '');
  return Number(stripped);
}
