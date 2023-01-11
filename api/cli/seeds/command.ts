import { Command } from 'commander';
import figlet from 'figlet';

import { generatePoolTournamentCommand } from './commands/generatePoolTournamentCommand';
import { sortPlayerAliasesCommand } from './commands/sortPlayerAliasesCommand';

const command = new Command('seeds')
  .description('Manage PGA Pool API seed data')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .addCommand(sortPlayerAliasesCommand)
  .addCommand(generatePoolTournamentCommand);

export const seedsCommand = command;
