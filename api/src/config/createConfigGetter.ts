import { ConfigService } from '@nestjs/config';

export function createConfigGetter(
  config: ConfigService,
  opts: { throwWhenMissing: boolean } = { throwWhenMissing: false }
) {
  return {
    get<T = string>(key: string): T {
      const val = config.get(key);
      if (typeof val === 'undefined' && opts.throwWhenMissing) {
        throw new Error(`Missing required config: ${key}`);
      }

      return val;
    },
  };
}
