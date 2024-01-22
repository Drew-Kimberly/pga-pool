import { Command } from 'commander';
import figlet from 'figlet';

import {
  addLeagueUserCommand,
  createLeagueCommand,
  deleteLeagueCommand,
  getLeagueCommand,
  listLeaguesCommand,
  updateLeagueCommand,
} from './commands/leagueCommands';

const command = new Command('leagues')
  .description('Manage Leagues')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .addCommand(getLeagueCommand)
  .addCommand(listLeaguesCommand)
  .addCommand(createLeagueCommand)
  .addCommand(updateLeagueCommand)
  .addCommand(deleteLeagueCommand)
  .addCommand(addLeagueUserCommand);

export const leaguesCommand = command;
