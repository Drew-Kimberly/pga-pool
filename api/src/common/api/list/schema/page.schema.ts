import Joi, { SchemaMap } from 'joi';

import { IListParams } from '../list.interface';

import { SchemaBuilder } from './schema.interface';

export const pageSchema: SchemaBuilder = {
  build(options) {
    const schemaMap: SchemaMap<IListParams['page']> = {
      number: Joi.number().integer().positive().default(1),
      size: Joi.number()
        .integer()
        .positive()
        .default(options.page.defaultPageSize)
        .max(options.page.maxPageSize),
    };
    return Joi.object(schemaMap);
  },
};
