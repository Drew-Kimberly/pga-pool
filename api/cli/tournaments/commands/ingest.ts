import { Command, Option } from 'commander';
import figlet from 'figlet';

import { ingestTournaments } from '../handler/ingestTournaments';

const command = new Command('ingest')
  .description('Ingest PGA Tournaments via the PGA Tour API')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .addOption(
    new Option(
      '--year <year>',
      '[Optional] Specify specific PGA Tour year to ingest tournaments from'
    ).default('')
  )
  .action((opts) => ingestTournaments(opts.year));

export const ingestTournamentsCommand = command;
