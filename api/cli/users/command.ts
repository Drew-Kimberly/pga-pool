import { Command } from 'commander';
import figlet from 'figlet';

import { getUserCommand } from './commands/getUserCommand';
import { ingestUsersCommand } from './commands/ingestUsersCommand';
import { listUsersCommand } from './commands/listUsersCommand';

const command = new Command('users')
  .description('Manage Users')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .addCommand(getUserCommand)
  .addCommand(listUsersCommand)
  .addCommand(ingestUsersCommand);

export const usersCommand = command;
