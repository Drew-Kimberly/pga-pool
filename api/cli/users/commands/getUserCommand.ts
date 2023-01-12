import { Command } from 'commander';
import figlet from 'figlet';

import { getUser } from '../handler/getUser';

const command = new Command('get')
  .description('Retrieve a user by ID')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .argument('<id>', 'The User ID')
  .action(getUser);

export const getUserCommand = command;
