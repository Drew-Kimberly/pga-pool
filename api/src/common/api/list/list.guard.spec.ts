import { FieldFilterSchema } from './schema/filter.schema';
import { SCHEMA_REGISTRY } from './schema/registry';
import { mergeDefaultOptions } from './util/mergeDefaultOptions';
import { LIST_OPTIONS, LIST_PARAMS_REQUEST_KEY } from './list.constants';
import { ListGuard } from './list.guard';

import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

describe('ListGuard', () => {
  afterEach(() => {
    SCHEMA_REGISTRY.clear();
  });

  const buildContext = (request: Record<string, unknown>, handlerName = 'list'): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => request,
      }),
      getHandler: () => ({
        name: handlerName,
      }),
      getClass: () => ({
        name: 'TestController',
      }),
    }) as unknown as ExecutionContext;

  it('accepts operator filters keyed by dot-notation fields', () => {
    const listOptions = mergeDefaultOptions({
      filter: {
        name: FieldFilterSchema.string(),
        active: FieldFilterSchema.boolean(),
        date: FieldFilterSchema.json({
          year: FieldFilterSchema.numeric(),
        }),
      },
    });

    SCHEMA_REGISTRY.register('TestController', 'list', listOptions);

    const reflector = {
      get: jest.fn().mockReturnValue(listOptions),
    } as unknown as Reflector;

    const guard = new ListGuard(reflector);

    const request = {
      query: {
        filter: {
          name: { contains: 'foo' },
          active: { eq: true },
          'date.year': { gte: 2025, lte: 2026 },
        },
      },
    } as Record<string, unknown>;

    const result = guard.canActivate(buildContext(request));

    expect(result).toBe(true);
    expect(reflector.get).toHaveBeenCalledWith(LIST_OPTIONS, expect.any(Object));
    expect((request as Record<string, unknown>)[LIST_PARAMS_REQUEST_KEY]).toMatchObject({
      filter: {
        name: { contains: 'foo' },
        active: { eq: true },
        'date.year': { gte: 2025, lte: 2026 },
      },
    });
  });

  it('rejects nested filter objects', () => {
    const listOptions = mergeDefaultOptions({
      filter: {
        date: FieldFilterSchema.json({
          year: FieldFilterSchema.numeric(),
        }),
      },
    });

    SCHEMA_REGISTRY.register('TestController', 'list', listOptions);

    const reflector = {
      get: jest.fn().mockReturnValue(listOptions),
    } as unknown as Reflector;

    const guard = new ListGuard(reflector);

    const request = {
      query: {
        filter: {
          date: { year: { gte: 2025 } },
        },
      },
    };

    expect(() => guard.canActivate(buildContext(request))).toThrow();
  });

  it('rejects plain timestamp filters without an operator', () => {
    const listOptions = mergeDefaultOptions({
      filter: {
        start_date: FieldFilterSchema.timestamp(),
      },
    });

    SCHEMA_REGISTRY.register('TestController', 'list', listOptions);

    const reflector = {
      get: jest.fn().mockReturnValue(listOptions),
    } as unknown as Reflector;

    const guard = new ListGuard(reflector);

    const request = {
      query: {
        filter: {
          start_date: '2025-01-02T03:04:05Z',
        },
      },
    };

    expect(() => guard.canActivate(buildContext(request))).toThrow();
  });

  it('accepts timestamp filters with comparison operators', () => {
    const listOptions = mergeDefaultOptions({
      filter: {
        start_date: FieldFilterSchema.timestamp(),
      },
    });

    SCHEMA_REGISTRY.register('TestController', 'list', listOptions);

    const reflector = {
      get: jest.fn().mockReturnValue(listOptions),
    } as unknown as Reflector;

    const guard = new ListGuard(reflector);

    const request = {
      query: {
        filter: {
          start_date: {
            gte: '2025-01-02T03:04:05Z',
            lt: '2026-01-01T00:00:00Z',
          },
        },
      },
    } as Record<string, unknown>;

    const result = guard.canActivate(buildContext(request));

    expect(result).toBe(true);
    expect((request as Record<string, unknown>)[LIST_PARAMS_REQUEST_KEY]).toMatchObject({
      filter: {
        start_date: {
          gte: '2025-01-02T03:04:05Z',
          lt: '2026-01-01T00:00:00Z',
        },
      },
    });
  });
});
