import { Command } from 'commander';
import figlet from 'figlet';

import { ingestPlayersCommand } from './commands/ingestPlayersCommand';

const command = new Command('players')
  .description('Manage PGA Players')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .addCommand(ingestPlayersCommand);

export const playersCommand = command;
