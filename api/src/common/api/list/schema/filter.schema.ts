import Joi, { AnySchema } from 'joi';

import { MergedListOptions } from '../list.interface';

import { SchemaBuilder } from './schema.interface';

import { NotFoundException } from '@nestjs/common';

export class FieldFilterSchema {
  static string() {
    return new FilterSchemaBuilder(Joi.string(), ['eq', 'neq', 'contains']);
  }

  static numeric() {
    return new FilterSchemaBuilder(Joi.number(), ['eq', 'neq', 'gt', 'gte', 'lt', 'lte']);
  }

  static boolean() {
    return new FilterSchemaBuilder(Joi.bool(), ['eq', 'neq']);
  }

  static enum(e: object) {
    return new FilterSchemaBuilder(
      Joi.string()
        .allow(...Object.values(e))
        .only(),
      ['eq', 'neq']
    );
  }

  static uuid() {
    return new FilterSchemaBuilder(
      Joi.string()
        .uuid()
        .error(() => {
          throw new NotFoundException();
        }),
      ['eq', 'neq']
    );
  }

  static timestamp() {
    return new FilterSchemaBuilder(Joi.string().isoDate().raw(), ['gt', 'gte', 'lt', 'lte'], false);
  }

  static json(fields: Record<string, FilterSchemaBuilder>) {
    return new JsonFilterSchemaBuilder(fields);
  }
}

export const filterSchema: SchemaBuilder = {
  build(options) {
    const schemaMap: Record<string, AnySchema> = {};

    Object.entries(options.filter).forEach(([field, schemaBuilder]) => {
      if (schemaBuilder instanceof JsonFilterSchemaBuilder) {
        const flattened = schemaBuilder.buildFlattened(field, options);
        Object.entries(flattened).forEach(([flattenedField, schema]) => {
          if (!(flattenedField in options.filter) && !(flattenedField in schemaMap)) {
            schemaMap[flattenedField] = schema;
          }
        });
        return;
      }

      schemaMap[field] = schemaBuilder.build(options);
    });

    return Joi.object(schemaMap).unknown(false);
  },
};

export class FilterSchemaBuilder<
  S extends AnySchema = AnySchema,
> implements SchemaBuilder<AnySchema> {
  constructor(
    protected schema: S,
    protected operators: string[] = [],
    protected allowPlain = true
  ) {}

  build(_options: MergedListOptions) {
    if (this.operators.length === 0) {
      return this.schema;
    }

    const operatorSchemaMap = Object.fromEntries(
      this.operators.map((operator) => [operator, this.schema])
    );

    const operatorSchema = Joi.object(operatorSchemaMap).min(1).unknown(false);

    if (this.allowPlain) {
      return Joi.alternatives().try(this.schema, operatorSchema);
    }

    return operatorSchema;
  }

  rule(fn: (schema: S) => S) {
    this.schema = fn(this.schema);

    return this;
  }

  getOperators() {
    return this.operators;
  }
}

export class JsonFilterSchemaBuilder extends FilterSchemaBuilder<Joi.ObjectSchema> {
  constructor(private readonly fields: Record<string, FilterSchemaBuilder>) {
    super(Joi.object());
  }

  build(options: MergedListOptions) {
    const schemaMap = Object.fromEntries(
      Object.entries(this.fields).map(([field, schemaBuilder]) => [
        field,
        schemaBuilder.build(options),
      ])
    );

    return Joi.object(schemaMap).unknown(false);
  }

  buildFlattened(prefix: string, options: MergedListOptions): Record<string, AnySchema> {
    const flattened: Record<string, AnySchema> = {};

    Object.entries(this.fields).forEach(([field, schemaBuilder]) => {
      const nextPrefix = `${prefix}.${field}`;

      if (schemaBuilder instanceof JsonFilterSchemaBuilder) {
        Object.assign(flattened, schemaBuilder.buildFlattened(nextPrefix, options));
        return;
      }

      flattened[nextPrefix] = schemaBuilder.build(options);
    });

    return flattened;
  }

  getFields() {
    return this.fields;
  }
}
