import { Command, Option } from 'commander';
import figlet from 'figlet';

import { ingestPoolTournaments } from '../handler/ingestPoolTournaments';

const command = new Command('ingest')
  .description('Ingest Pool Tournament via the PGA Tour API')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .addOption(
    new Option(
      '--year <year>',
      'Specify a year to ingest tournaments from. By default it will ingest from all years'
    )
  )
  .addOption(
    new Option(
      '--pgaTournamentId <id>',
      'Specify a specific tournament to ingest (format: "{tournamentId}-{year}"'
    )
  )
  .action((opts) => ingestPoolTournaments(opts.year, opts.pgaTournamentId));

export const ingestPoolTournamentsCommand = command;
