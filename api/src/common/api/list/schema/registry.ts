import { Schema } from 'joi';

import { MergedListOptions } from '../list.interface';

import { listParamSchema } from './list.schema';

export class ListSchemaRegistry {
  constructor(protected builtSchemas = new Map<string, Schema>()) {}

  register(controllerName: string, routeName: string, options: MergedListOptions) {
    const schema = listParamSchema.build(options);

    this.builtSchemas.set(this.createSchemaKey(controllerName, routeName), schema);

    return schema;
  }

  deregister(controllerName: string, routeName: string) {
    this.builtSchemas.delete(this.createSchemaKey(controllerName, routeName));
  }

  get(controllerName: string, routeName: string): Schema | undefined {
    return this.builtSchemas.get(this.createSchemaKey(controllerName, routeName));
  }

  getAll(): [string, Schema][] {
    return Array.from(this.builtSchemas);
  }

  clear(): void {
    this.builtSchemas.clear();
  }

  createSchemaKey(controllerName: string, routeName: string) {
    return `${controllerName}_${routeName}_ListParam_Schema`;
  }
}

export const SCHEMA_REGISTRY = new ListSchemaRegistry();
