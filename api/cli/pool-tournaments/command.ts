import { Command } from 'commander';
import figlet from 'figlet';

import { ingestPoolTournamentsCommand } from './commands/ingestPoolTournamentsCommand';

const command = new Command('pool-tournaments')
  .description('Manage Pool Tournaments')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .addCommand(ingestPoolTournamentsCommand);

export const poolTournamentsCommand = command;
