/**
 * TypeORM CLI Wrapper for generating schema migrations.
 */

import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

import dotenv from 'dotenv';

const asyncExec = promisify(exec);
dotenv.config();

const dataSourcePath = path.resolve(
  __dirname,
  '..',
  'src',
  'database',
  'migrations',
  'datasource',
  'datasource.ts'
);

const typeormExecutable = path.resolve(__dirname, '..', 'node_modules', '.bin', 'typeorm');
const typeormArgs = process.argv.slice(2).join(' ');

const cmdEnvVars = `POSTGRES_PORT=${process.env.POSTGRES_PORT} POSTGRES_USER=${process.env.POSTGRES_USER} POSTGRES_PASSWORD=${process.env.POSTGRES_PASSWORD} POSTGRES_DB=${process.env.POSTGRES_DB} POSTGRES_HOST=${process.env.POSTGRES_HOST} POSTGRES_ENABLE_SSL=${process.env.POSTGRES_ENABLE_SSL}`;
const cmd = `${cmdEnvVars} node --require ts-node/register --require tsconfig-paths/register ${typeormExecutable} ${typeormArgs} --dataSource=${dataSourcePath}`;

console.log(`Executing command: ${cmd}`);

asyncExec(cmd)
  .then((output) => console.log(output.stdout))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
