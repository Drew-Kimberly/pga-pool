import fs from 'fs';
import os from 'os';

import { PgaPlayerService } from '../../../src/pga-player/lib/pga-player.service';
import { SeedDataService } from '../../../src/seed-data/lib/seed-data.service';
import { PgaPoolCliModule } from '../../cli.module';

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

export async function generatePoolTournament(
  pickSheetPath: string,
  tournamentId: string,
  year: string
) {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCliModule, {
    logger: ['log', 'warn', 'error'],
  });
  const seedDataService = ctx.get(SeedDataService);
  const pgaPlayerService = ctx.get(PgaPlayerService);
  const logger = new Logger(generatePoolTournament.name);
  const seedData: Record<number, Record<number, { name: string }>> = {
    1: {},
    2: {},
    3: {},
    4: {},
  };

  const txtData = fs.readFileSync(pickSheetPath.replace('~', os.homedir())).toString();

  const tieredData = txtData.split('--');
  const missingPlayers = [];

  for (let tier = 0; tier < tieredData.length; tier++) {
    const playerNames = tieredData[tier]
      .replace(/\r\n/g, '|||')
      .split('|||')
      .filter(Boolean)
      .map((n) => n.trim());

    for (const name of playerNames) {
      let pgaPlayers = await pgaPlayerService.list({ filter: { name } });
      if (pgaPlayers.length === 1) {
        seedData[tier + 1][pgaPlayers[0].id] = { name: pgaPlayers[0].name };
      } else {
        let pushed = false;
        for (const subname of name.split(' ').map((n) => n.trim())) {
          pgaPlayers = await pgaPlayerService.list({ filter: { name: subname } });
          if (pgaPlayers.length === 1) {
            pushed = true;
            seedData[tier + 1][pgaPlayers[0].id] = { name: pgaPlayers[0].name };
            break;
          }
        }
        if (!pushed) {
          missingPlayers.push([name, tier + 1]);
        }
      }
    }
  }

  const seedDir = `${seedDataService.getSeedDirPath()}/${tournamentId}-${year}`;
  fs.mkdirSync(seedDir, { recursive: true });
  fs.writeFileSync(`${seedDir}/field.json`, JSON.stringify(seedData, null, 4));

  missingPlayers.forEach(([name, tier]) => logger.error(name + ' ' + tier));

  await ctx.close();
}
