import { ObjectSchema, SchemaLike } from 'joi';

import { MergedListOptions } from '../list.interface';

export interface SchemaBuilder<S extends SchemaLike = ObjectSchema> {
  build(options: MergedListOptions): S;
}
