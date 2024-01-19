import { Command } from 'commander';
import figlet from 'figlet';

import { createLeague } from '../handler/createLeague';
import { deleteLeague } from '../handler/deleteLeague';
import { getLeague } from '../handler/getLeague';
import { listLeagues } from '../handler/listLeagues';
import { updateLeague } from '../handler/updateLeague';

const get = new Command('get')
  .description('Retrieve a league by ID')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .argument('<id>', 'The League ID')
  .action(getLeague);

const list = new Command('list')
  .description('List leagues')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .action(listLeagues);

const create = new Command('create')
  .description('Creates a new league')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .argument('<name>', 'The League Name')
  .action(createLeague);

const update = new Command('update')
  .description('Updates an existing league')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .argument('<id>', 'The League ID')
  .argument('<name>', 'The League Name')
  .action(updateLeague);

const del = new Command('delete')
  .description('Delete a league by ID')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .argument('<id>', 'The League ID')
  .action(deleteLeague);

export const getLeagueCommand = get;
export const listLeaguesCommand = list;
export const createLeagueCommand = create;
export const updateLeagueCommand = update;
export const deleteLeagueCommand = del;
