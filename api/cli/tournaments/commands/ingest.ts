import { Command } from 'commander';
import figlet from 'figlet';

import { ingestTournaments } from '../handler/ingestTournaments';

const command = new Command('ingest')
  .description('Ingest PGA Tournaments via the PGA Tour API')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .action(ingestTournaments);

export const ingestTournamentsCommand = command;
