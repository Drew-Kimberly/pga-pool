import Joi from 'joi';

import { pageSchema } from './page.schema';
import { SchemaBuilder } from './schema.interface';

export const listParamSchema: SchemaBuilder = {
  build(options) {
    return Joi.object({
      page: pageSchema.build(options),
    });
  },
};
