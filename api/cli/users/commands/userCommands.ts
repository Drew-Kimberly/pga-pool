import { Command } from 'commander';
import figlet from 'figlet';

import { envAware, parseOptionalBool } from '../../utils';
import { createUser } from '../handler/createUser';
import { deleteUser } from '../handler/deleteUser';
import { getUser } from '../handler/getUser';
import { listUsers } from '../handler/listUsers';
import { updateUser } from '../handler/updateUser';

const get = new Command('get')
  .description('Retrieve a user by ID')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .argument('<id>', 'The User ID', envAware)
  .action(getUser);

const list = new Command('list')
  .description('List users')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .action(listUsers);

const create = new Command('create')
  .description('Create user')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .option('-n, --name <name>', "User's name", envAware)
  .option('--nickname [nickname]', "User's nickname", envAware)
  .option('-e, --email [email]', "User's email address", envAware)
  .option('--admin [is-admin]', 'Whether the user is a site administrator', (val) =>
    parseOptionalBool(envAware(val))
  )
  .action(() =>
    createUser(create.opts().name, create.opts().nickname, create.opts().email, create.opts().admin)
  );

const update = new Command('update')
  .description('Update user')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .argument('<id>', 'The User ID', envAware)
  .option('-n, --name [name]', "User's name", envAware)
  .option('--nickname [nickname]', "User's nickname", envAware)
  .option('-e, --email [email]', "User's email address", envAware)
  .option('--admin [is-admin]', 'Whether the user is a site administrator', (val) =>
    parseOptionalBool(envAware(val))
  )
  .action((id) =>
    updateUser(
      id,
      update.opts().name,
      update.opts().nickname,
      update.opts().email,
      update.opts().admin
    )
  );

const del = new Command('delete')
  .description('Delete a user by ID')
  .addHelpText('before', figlet.textSync('PGA Pool', { horizontalLayout: 'fitted' }))
  .argument('<id>', 'The User ID', envAware)
  .action(deleteUser);

export const getUserCommand = get;
export const listUserCommand = list;
export const createUserCommand = create;
export const updateUserCommand = update;
export const deleteUserCommand = del;
