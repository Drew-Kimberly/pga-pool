import { Command } from 'commander';
import figlet from 'figlet';

import { envAware, parseOptionalBool } from '../../utils';
import { addLeagueUser } from '../handler/addLeagueUser';
import { createLeague } from '../handler/createLeague';
import { deleteLeague } from '../handler/deleteLeague';
import { getLeague } from '../handler/getLeague';
import { listLeagues } from '../handler/listLeagues';
import { updateLeague } from '../handler/updateLeague';

const get = new Command('get')
  .description('Retrieve a league by ID')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .argument('<id>', 'The League ID', envAware)
  .action(getLeague);

const list = new Command('list')
  .description('List leagues')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .action(listLeagues);

const create = new Command('create')
  .description('Creates a new league')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .argument('<name>', 'The League Name', envAware)
  .action(createLeague);

const update = new Command('update')
  .description('Updates an existing league')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .argument('<id>', 'The League ID', envAware)
  .argument('<name>', 'The League Name', envAware)
  .action(updateLeague);

const del = new Command('delete')
  .description('Delete a league by ID')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .argument('<id>', 'The League ID', envAware)
  .action(deleteLeague);

const addUser = new Command('add-user')
  .description('Adds a user to the league')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .option('-l, --league <leagueId>', 'The League ID', envAware)
  .option('-u, --user <userId>', 'The User ID', envAware)
  .option('--is-owner [is-owner]', 'Whether the user is a league owner', (val) =>
    parseOptionalBool(envAware(val))
  )
  .action(() => addLeagueUser(addUser.opts().league, addUser.opts().user, addUser.opts().isOwner));

export const getLeagueCommand = get;
export const listLeaguesCommand = list;
export const createLeagueCommand = create;
export const updateLeagueCommand = update;
export const deleteLeagueCommand = del;
export const addLeagueUserCommand = addUser;
