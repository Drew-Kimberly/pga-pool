import Joi, { AnySchema } from 'joi';

import { MergedListOptions } from '../list.interface';

import { SchemaBuilder } from './schema.interface';

import { NotFoundException } from '@nestjs/common';

export class FieldFilterSchema {
  static string() {
    return new FilterSchemaBuilder(Joi.string());
  }

  static numeric() {
    return new FilterSchemaBuilder(Joi.number());
  }

  static boolean() {
    return new FilterSchemaBuilder(Joi.bool());
  }

  static enum(e: object) {
    return new FilterSchemaBuilder(
      Joi.string()
        .allow(...Object.values(e))
        .only()
    );
  }

  static uuid() {
    return new FilterSchemaBuilder(
      Joi.string()
        .uuid()
        .error(() => {
          throw new NotFoundException();
        })
    );
  }
}

export const filterSchema: SchemaBuilder = {
  build(options) {
    const schemaMap = Object.fromEntries(
      Object.entries(options.filter).map(([field, schemaBuilder]) => [
        field,
        schemaBuilder.build(options),
      ])
    );

    return Joi.object(schemaMap).unknown(false);
  },
};

export class FilterSchemaBuilder<S extends AnySchema = AnySchema> implements SchemaBuilder<S> {
  constructor(protected schema: S) {}

  build(_options: MergedListOptions) {
    return this.schema;
  }

  rule(fn: (schema: S) => S) {
    this.schema = fn(this.schema);

    return this;
  }
}
