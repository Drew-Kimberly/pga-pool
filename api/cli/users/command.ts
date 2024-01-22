import { Command } from 'commander';
import figlet from 'figlet';

import {
  createUserCommand,
  deleteUserCommand,
  getUserCommand,
  listUserCommand,
  updateUserCommand,
} from './commands/userCommands';

const command = new Command('users')
  .description('Manage Users')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .addCommand(getUserCommand)
  .addCommand(listUserCommand)
  .addCommand(createUserCommand)
  .addCommand(updateUserCommand)
  .addCommand(deleteUserCommand);

export const usersCommand = command;
