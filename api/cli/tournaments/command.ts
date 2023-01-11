import { Command } from 'commander';
import figlet from 'figlet';

import { ingestTournamentsCommand } from './commands/ingest';

const command = new Command('tournaments')
  .description('Manage PGA Tournaments')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .addCommand(ingestTournamentsCommand);

export const tournamentsCommand = command;
