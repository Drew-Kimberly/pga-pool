import path from 'path';
import { TlsOptions } from 'tls';

import { DataSourceOptions } from 'typeorm';
import { PostgresConnectionCredentialsOptions } from 'typeorm/driver/postgres/PostgresConnectionCredentialsOptions';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { IDatabaseConfig, InjectDatabaseConfig } from './database-config';

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export type CredentialConnectionOptions =
  | { replication: PostgresConnectionOptions['replication'] }
  | Partial<PostgresConnectionCredentialsOptions>;

export class TypeOrmOptionsFactory {
  constructor(
    @InjectDatabaseConfig()
    private readonly databaseConfig: IDatabaseConfig
  ) {}

  createTypeOrmOptions(entities: DataSourceOptions['entities']): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      synchronize: false,
      cache: false,
      logging: this.databaseConfig.ENABLE_SQL_DEBUG_LOG,
      entities,
      migrationsRun: this.databaseConfig.POSTGRES_ENABLE_SCHEMA_MIGRATION,
      migrations: [path.resolve(__dirname, 'migrations', '*{.ts,.js}')],
      migrationsTableName: 'typeorm_migrations',
      host: this.databaseConfig.POSTGRES_HOST,
      port: this.databaseConfig.POSTGRES_PORT,
      username: this.databaseConfig.POSTGRES_USER,
      password: this.databaseConfig.POSTGRES_PASSWORD,
      database: this.databaseConfig.POSTGRES_DB,
      ssl: this.databaseConfig.POSTGRES_ENABLE_SSL
        ? ({
            checkServerIdentity: () => undefined,
          } as TlsOptions)
        : false,
    };
  }
}
