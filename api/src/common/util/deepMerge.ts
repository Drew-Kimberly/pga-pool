import merge from 'deepmerge';

import { DeepPartial } from '../types';

export function deepMerge<T>(x: DeepPartial<T>, y: DeepPartial<T>) {
  return merge<T>(x as Partial<T>, y as Partial<T>, { arrayMerge: (_, src) => src });
}
