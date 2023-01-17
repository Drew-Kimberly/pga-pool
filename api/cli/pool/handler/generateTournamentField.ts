import fs from 'fs';

import { MetabetApiService } from '../../../src/metabet-api/lib/metabet-api.service';
import { PgaPlayerService } from '../../../src/pga-player/lib/pga-player.service';
import { PgaTournamentService } from '../../../src/pga-tournament/lib/pga-tournament.service';
import { SeedDataService } from '../../../src/seed-data/lib/seed-data.service';
import { PgaPoolCliModule } from '../../cli.module';
import { outputJson } from '../../utils';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

interface TournamentField {
  [tier: string]: {
    [playerId: string]: {
      name: string;
      odds: string;
    };
  };
}

export async function generateTournamentField(pgaTournamentId: string, tierCutoffs: number[]) {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCliModule);
  const pgaTourneyService = ctx.get(PgaTournamentService);
  const pgaPlayerService = ctx.get(PgaPlayerService);
  const metabetApiService = ctx.get(MetabetApiService);
  const seedDataService = ctx.get(SeedDataService);

  const logger = new Logger(generateTournamentField.name);

  const pgaTournament = await pgaTourneyService.get(pgaTournamentId);
  if (!pgaTournament) {
    throw new Error(`No PGA Tournament (ID: ${pgaTournamentId}) found!`);
  }

  const tournamentOdds = (await metabetApiService.getOdds()).find(
    (o) =>
      [pgaTournament.full_name.toLowerCase(), pgaTournament.short_name.toLowerCase()].includes(
        o.tournamentName.toLowerCase()
      ) && pgaTournament.year === o.year
  );

  if (!tournamentOdds) {
    throw new Error(
      `No tournament odds found for ${pgaTournament.year} ${pgaTournament.full_name} (ID: ${pgaTournament.id})`
    );
  }

  tournamentOdds.players.sort((a, b) => (a.odds <= b.odds ? -1 : 1));

  const pgaPlayers = Object.fromEntries((await pgaPlayerService.list()).map((p) => [p.name, p]));
  const field: TournamentField = {};
  const playersNotFound: { name: string; odds: number; tier: number }[] = [];

  let oddsIdx = 0;
  for (let tier = 1; tier <= tierCutoffs.length + 1; tier++) {
    const cutoff = tierCutoffs[tier - 1] ?? Number.MAX_SAFE_INTEGER;
    field[tier] = {};

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

      field[tier][pgaPlayer.id] = {
        name: pgaPlayer.name,
        odds: toOddsString(tournamentOdds.players[oddsIdx].odds),
      };

      oddsIdx++;
    }
  }

  const seedDir = `${seedDataService.getSeedDirPath()}/${pgaTournament.id}`;
  fs.mkdirSync(seedDir, { recursive: true });
  fs.writeFileSync(`${seedDir}/field.json`, JSON.stringify(field, null, 4));

  logger.log(`Writing the following to ${seedDir}/field.json`);
  outputJson(field);

  playersNotFound.forEach((p) => {
    logger.warn(`No PGA Player found for ${p.name} ${toOddsString(p.odds)} (Tier ${p.tier})`);
  });

  await ctx.close();
}

function toOddsString(odds: number) {
  return odds < 0 ? odds.toString() : `+${odds}`;
}
