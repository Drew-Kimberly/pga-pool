import { deepMerge } from '../../../util';
import { defaultListOptions } from '../list.constants';
import { ListOptions, MergedListOptions } from '../list.interface';

export function mergeDefaultOptions(options: ListOptions): MergedListOptions {
  return deepMerge(defaultListOptions, options) as MergedListOptions;
}
