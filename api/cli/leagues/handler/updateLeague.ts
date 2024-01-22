import { LeagueService } from '../../../src/league/lib/league.service';
import { PgaPoolCliModule } from '../../cli.module';
import { outputJson } from '../../utils';

import { NestFactory } from '@nestjs/core';

export async function updateLeague(id: string, name: string) {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCliModule, {
    logger: ['log', 'warn', 'error'],
  });
  const leagueService = ctx.get(LeagueService);

  let league = await leagueService.get(id);
  if (!league) {
    throw new Error(`League ${id} not found!`);
  }

  await leagueService.update({ id, name });

  league = await leagueService.get(id);

  outputJson(league);

  await ctx.close();
}
