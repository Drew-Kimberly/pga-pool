import Joi from 'joi';

import { filterSchema } from './filter.schema';
import { pageSchema } from './page.schema';
import { SchemaBuilder } from './schema.interface';

export const listParamSchema: SchemaBuilder = {
  build(options) {
    return Joi.object({
      page: pageSchema.build(options),
      filter: filterSchema.build(options),
    });
  },
};
