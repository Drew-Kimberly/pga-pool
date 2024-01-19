import { LeagueService } from '../../../src/league/lib/league.service';
import { PgaPoolCliModule } from '../../cli.module';
import { outputJson } from '../../utils';

import { NestFactory } from '@nestjs/core';

export async function listLeagues() {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCliModule, {
    logger: ['log', 'warn', 'error'],
  });
  const leagueService = ctx.get(LeagueService);

  const leagues = await leagueService.list();

  outputJson(leagues);

  await ctx.close();
}
