import { Command } from 'commander';
import figlet from 'figlet';

import {
  createLeagueCommand,
  deleteLeagueCommand,
  getLeagueCommand,
  listLeaguesCommand,
  updateLeagueCommand,
} from './commands/crudCommands';

const command = new Command('leagues')
  .description('Manage Leagues')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .addCommand(getLeagueCommand)
  .addCommand(listLeaguesCommand)
  .addCommand(createLeagueCommand)
  .addCommand(updateLeagueCommand)
  .addCommand(deleteLeagueCommand);

export const leaguesCommand = command;
