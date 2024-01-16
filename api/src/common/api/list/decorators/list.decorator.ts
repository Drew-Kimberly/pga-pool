import { LIST_OPTIONS } from '../list.constants';
import { ListGuard } from '../list.guard';
import { ListOptions } from '../list.interface';
import { SCHEMA_REGISTRY } from '../schema';
import { mergeDefaultOptions } from '../util/mergeDefaultOptions';

import { applyDecorators, Get, SetMetadata, UseGuards } from '@nestjs/common';

type Target = {
  name?: string;
  constructor?: {
    name: string;
  };
};

export function List(options: ListOptions = {}): MethodDecorator {
  const merged = mergeDefaultOptions(options);

  return applyDecorators(
    Get(options.path),
    SetMetadata(LIST_OPTIONS, merged),
    (target: Target, methodName: string | symbol) => {
      SCHEMA_REGISTRY.register(
        target.name ?? target.constructor?.name ?? 'UNKNOWN',
        methodName.toString(),
        merged
      );
    },
    UseGuards(ListGuard)
  );
}
