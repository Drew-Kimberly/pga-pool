import { createConfigGetter } from '../../../config';

import { FactoryProvider, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface PgaTourApiConfig {
  PGA_TOUR_API_GQL_URL: string;
  PGA_TOUR_API_GQL_API_KEY: string;
}

export const PGA_TOUR_API_CONFIG = Symbol('PGA_TOUR_API_CONFIG');
export const InjectPgaTourApiConfig = () => Inject(PGA_TOUR_API_CONFIG);

export const pgaTourApiConfigProvider: FactoryProvider<PgaTourApiConfig> = {
  provide: PGA_TOUR_API_CONFIG,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const get = createConfigGetter(config, { throwWhenMissing: true }).get;

    return {
      PGA_TOUR_API_GQL_URL: get<string>('PGA_TOUR_API_GQL_URL'),
      PGA_TOUR_API_GQL_API_KEY: get<string>('PGA_TOUR_API_GQL_API_KEY'),
    };
  },
};
