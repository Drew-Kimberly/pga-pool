import { Command, Option } from 'commander';
import figlet from 'figlet';

import { ingestPlayers } from '../handler/ingestPlayers';

const command = new Command('ingest')
  .description('Ingest PGA Players via the PGA Tour API')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .addOption(
    new Option(
      '--inactive',
      'Specify whether to ingest inactive players. Defaults to false.'
    ).default(false)
  )
  .action((opts) => {
    return ingestPlayers(opts.inactive);
  });

export const ingestPlayersCommand = command;
