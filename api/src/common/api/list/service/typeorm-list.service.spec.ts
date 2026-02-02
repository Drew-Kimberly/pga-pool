import { FindManyOptions } from 'typeorm';

import { TypeOrmListService } from './typeorm-list.service';

describe('TypeOrmListService', () => {
  it('applies operator filters when listing', async () => {
    const repo = {
      findAndCount: jest.fn().mockResolvedValue([[], 0]),
    };
    const dataSource = {
      getRepository: jest.fn().mockReturnValue(repo),
    };

    const service = new TypeOrmListService(dataSource as never);

    await service.list(
      {
        page: { number: 1, size: 10 },
        filter: {
          name: 'exact',
          score: { gte: 10, lt: 20 },
          active: { neq: false },
          start_date: { gte: '2025-01-02T03:04:05Z' },
          year: 2024,
        },
      },
      {
        entityType: class TestEntity {},
      }
    );

    expect(repo.findAndCount).toHaveBeenCalledTimes(1);
    const findOptions = repo.findAndCount.mock.calls[0][0] as FindManyOptions<unknown>;
    const where = findOptions.where as Record<string, { type: string; value?: unknown }>;

    expect(where.name.type).toBe('equal');
    expect(where.score.type).toBe('and');
    expect(Array.isArray(where.score.value)).toBe(true);
    expect(where.active.type).toBe('not');
    expect(where.start_date.type).toBe('moreThanOrEqual');
    expect(where.year.type).toBe('equal');
  });
});
