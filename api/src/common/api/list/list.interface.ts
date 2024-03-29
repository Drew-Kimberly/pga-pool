import { DeepPartial } from '../../types';

import { FilterSchemaBuilder } from './schema/filter.schema';

export interface Listable<T> {
  list(params: IListParams): Promise<PaginatedCollection<T>>;
}

// --- Start List Options

export type ListOptions = DeepPartial<MergedListOptions> & {
  path?: string;
};

export interface MergedListOptions {
  page: {
    /** @default 100 */
    defaultPageSize: number;
    /** @default 250 */
    maxPageSize: number;
  };
  filter: Record<string, FilterSchemaBuilder>;
}

// --- End List Params

// --- Start List Params

export type InvalidatedListParams = DeepPartial<IListParams>;

export interface IListParams {
  page: {
    size: number;
    number: number;
  };
  filter: Record<string, FilterValue>;
}

export type FilterValue = string | number | boolean;

// --- End List Params

export interface PaginatedCollection<T> {
  data: T[];
  meta: {
    /**
     * Requested page size.
     */
    requested_size: number;

    /**
     * Specifies the actual size of the page returned.
     */
    actual_size: number;

    /**
     * Specifies the current page number (1-based index).
     */
    number: number;

    /**
     * Total amount of items.
     */
    total?: number;
  };
}
