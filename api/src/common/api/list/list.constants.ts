import { IListParams, ListOptions } from './list.interface';

export const LIST_OPTIONS = 'LIST_OPTIONS';

export const LIST_PARAMS_REQUEST_KEY = 'listParams';

export const defaultListOptions: ListOptions = {
  page: {
    defaultPageSize: 100,
    maxPageSize: 250,
  },
  filter: {},
};

export const defaultListParams: IListParams = {
  filter: {},
  page: { number: 1, size: 100 },
};
