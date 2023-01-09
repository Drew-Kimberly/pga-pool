/* eslint-disable @typescript-eslint/no-var-requires */
import { DataSource } from 'typeorm';

const datasource = new DataSource(require('./ormconfig'));

export default datasource;
