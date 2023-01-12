import { Command } from 'commander';
import figlet from 'figlet';

import { ingestUsers } from '../handler/ingestUsers';

const command = new Command('ingest')
  .description('Ingest Users from a seed data file')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .action(ingestUsers);

export const ingestUsersCommand = command;
