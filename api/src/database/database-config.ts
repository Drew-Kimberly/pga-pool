import { createConfigGetter } from 'src/config';

import { FactoryProvider, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface IDatabaseConfig {
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  POSTGRES_ENABLE_SSL: boolean;
  ENABLE_SQL_DEBUG_LOG?: boolean;
}

export const DATABASE_CONFIG = Symbol('DATABASE_CONFIG');
export const InjectDatabaseConfig = () => Inject(DATABASE_CONFIG);

export const databaseConfigProvider: FactoryProvider<IDatabaseConfig> = {
  provide: DATABASE_CONFIG,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const get = createConfigGetter(config, { throwWhenMissing: true }).get;

    return {
      POSTGRES_DB: get<string>('POSTGRES_DB'),
      POSTGRES_HOST: get<string>('POSTGRES_HOST'),
      POSTGRES_USER: get<string>('POSTGRES_USER'),
      POSTGRES_PASSWORD: get<string>('POSTGRES_PASSWORD'),
      POSTGRES_PORT: Number(get<string>('POSTGRES_PORT')),
      POSTGRES_ENABLE_SSL: config.get('POSTGRES_ENABLE_SSL') === 'false',
      ENABLE_SQL_DEBUG_LOG: config.get<string>('ENABLE_SQL_DEBUG_LOG') === 'true',
    };
  },
};
