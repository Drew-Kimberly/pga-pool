import { Command } from 'commander';
import figlet from 'figlet';

import { pgaTournamentLeaderboardCommand } from './pga-tournament-leaderboard';
import { playersCommand } from './players';
import { seedsCommand } from './seeds';
import { tournamentsCommand } from './tournaments';
import { usersCommand } from './users';

export interface PgaPoolCli extends Command {
  run: (args: string[]) => Promise<void>;
}

export function createCli(): PgaPoolCli {
  const cli = new Command('pgapool') as PgaPoolCli;

  cli
    .description('A CLI exposing development/operational tasks for PGA Pool API')
    .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
    .addCommand(seedsCommand)
    .addCommand(playersCommand)
    .addCommand(tournamentsCommand)
    .addCommand(pgaTournamentLeaderboardCommand)
    .addCommand(usersCommand);

  cli.run = async function (args: string[]) {
    if (args.length <= 2) {
      return this.outputHelp();
    }

    this.parse(args);
  };

  return cli;
}
