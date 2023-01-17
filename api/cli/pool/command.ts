import { Command } from 'commander';
import figlet from 'figlet';

import { generateTournamentFieldCommand } from './commands/generateTournamentFieldCommand';

const command = new Command('pools')
  .description('Manage PGA pools')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .addCommand(generateTournamentFieldCommand);

export const poolsCommand = command;
