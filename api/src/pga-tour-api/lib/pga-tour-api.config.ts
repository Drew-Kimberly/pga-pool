import { createConfigGetter } from '../../config';

import { FactoryProvider, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface IPgaTourApiConfig {
  USER_ID: string;
  USER_TRACKING_ID_SCRIPT_URL: string;
}

export const PGA_TOUR_API_CONFIG = Symbol('PGA_TOUR_API_CONFIG');
export const InjectPgaTourApiConfig = () => Inject(PGA_TOUR_API_CONFIG);

export const pgaTourApiConfigProvider: FactoryProvider<IPgaTourApiConfig> = {
  provide: PGA_TOUR_API_CONFIG,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const get = createConfigGetter(config, { throwWhenMissing: true }).get;

    return {
      USER_ID: get<string>('USER_ID'),
      USER_TRACKING_ID_SCRIPT_URL: get<string>('USER_TRACKING_ID_SCRIPT_URL'),
    };
  },
};
