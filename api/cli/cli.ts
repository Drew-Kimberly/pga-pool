import { Command } from 'commander';
import figlet from 'figlet';

import { playersCommand } from './players';
import { tournamentsCommand } from './tournaments';

export interface PgaPoolCli extends Command {
  run: (args: string[]) => Promise<void>;
}

export function createCli(): PgaPoolCli {
  const cli = new Command('pgapool') as PgaPoolCli;

  cli
    .description('A CLI exposing development/operational tasks for PGA Pool API')
    .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
    .addCommand(playersCommand)
    .addCommand(tournamentsCommand);

  cli.run = async function (args: string[]) {
    if (args.length <= 2) {
      return this.outputHelp();
    }

    this.parse(args);
  };

  return cli;
}
