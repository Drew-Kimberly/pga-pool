import { Command } from 'commander';
import figlet from 'figlet';

import { listUsers } from '../handler/listUsers';

const command = new Command('list')
  .description('List users')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .action(listUsers);

export const listUsersCommand = command;
