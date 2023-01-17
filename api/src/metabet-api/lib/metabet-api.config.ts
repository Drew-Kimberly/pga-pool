import { createConfigGetter } from '../../config';

import { FactoryProvider, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface MetabetApiConfig {
  METABET_API_KEY: string;
}

export const METABET_API_CONFIG = Symbol('METABET_API_CONFIG');
export const InjectMetabetApiConfig = () => Inject(METABET_API_CONFIG);

export const metabetApiConfigProvider: FactoryProvider<MetabetApiConfig> = {
  provide: METABET_API_CONFIG,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const get = createConfigGetter(config, { throwWhenMissing: true }).get;

    return {
      METABET_API_KEY: get<string>('METABET_API_KEY'),
    };
  },
};
