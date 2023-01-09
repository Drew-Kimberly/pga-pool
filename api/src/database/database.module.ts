import { DataSourceOptions } from 'typeorm';

import { DATABASE_CONFIG, databaseConfigProvider, IDatabaseConfig } from './database-config';
import { TypeOrmOptionsFactory } from './typeorm-options-factory.service';

import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({})
export class DatabaseModule {
  static register(entities: DataSourceOptions['entities']): DynamicModule {
    return {
      module: DatabaseModule,
      global: true,
      imports: [
        TypeOrmModule.forRootAsync({
          inject: [DATABASE_CONFIG],
          useFactory: (dbConfig: IDatabaseConfig) =>
            new TypeOrmOptionsFactory(dbConfig).createTypeOrmOptions(entities),
        }),
      ],
      providers: [databaseConfigProvider],
      exports: [databaseConfigProvider],
    };
  }
}
