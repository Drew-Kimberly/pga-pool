import { Command } from 'commander';
import figlet from 'figlet';

import { generatePoolTournamentCommand } from './commands/generatePoolTournamentCommand';

const command = new Command('seeds')
  .description('Manage PGA Pool API seed data')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .addCommand(generatePoolTournamentCommand);

export const seedsCommand = command;
