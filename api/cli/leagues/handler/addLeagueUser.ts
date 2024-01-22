import { LeagueUserService } from '../../../src/league-user/lib/league-user.service';
import { PgaPoolCliModule } from '../../cli.module';
import { outputJson } from '../../utils';

import { NestFactory } from '@nestjs/core';

export async function addLeagueUser(leagueId: string, userId: string, isOwner: boolean = false) {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCliModule, {
    logger: ['log', 'warn', 'error'],
  });
  const leagueUserService = ctx.get(LeagueUserService);

  const user = await leagueUserService.create({
    league_id: leagueId,
    user_id: userId,
    is_owner: isOwner,
  });

  outputJson(user);

  await ctx.close();
}
