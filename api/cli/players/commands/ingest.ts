import { Command, Option } from 'commander';
import figlet from 'figlet';

import { ingestPlayers } from '../handler/ingestPlayers';

const command = new Command('ingest')
  .description('Ingest PGA Players via the PGA Tour API')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .addOption(
    new Option(
      '--from <year>',
      'Specify the earliest year to ingest players from. Defaults to the current year'
    ).default(new Date().getFullYear().toString())
  )
  .action((opts) => {
    return ingestPlayers(opts.from);
  });

export const ingestPlayersCommand = command;
