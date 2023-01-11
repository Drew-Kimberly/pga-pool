import fs from 'fs';

import { SeedDataService } from '../../../src/seed-data/lib/seed-data.service';
import { PgaPoolCliModule } from '../../cli.module';

import { NestFactory } from '@nestjs/core';

const seedFilename = 'player_aliases.json';

export async function sortPlayerAliases() {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCliModule);
  const seedDataService = ctx.get(SeedDataService);

  const seedData = Object.entries(
    seedDataService.getSeedData<Record<string, string>>('player_aliases') as Record<string, string>
  );

  seedData.sort((a, b) => (a[0] <= b[0] ? -1 : 1));

  fs.writeFileSync(
    `${seedDataService.getSeedDirPath()}/${seedFilename}`,
    JSON.stringify(Object.fromEntries(seedData), null, 4)
  );

  await ctx.close();
}
