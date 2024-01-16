import {
  DataSource,
  Equal,
  FindManyOptions,
  FindOperator,
  FindOptionsWhere,
  ILike,
  IsNull,
  ObjectLiteral,
} from 'typeorm';

import { IListParams, Listable, PaginatedCollection } from '../list.interface';

import { Injectable, Type } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

export interface TypeOrmListOptions<T extends ObjectLiteral = ObjectLiteral> {
  entityType: Type<T>;
  fieldMap?: Record<string, string>;
  onFindOptions?: (opts: FindManyOptions<T>) => void;
}

@Injectable()
export class TypeOrmListService<T extends ObjectLiteral = ObjectLiteral> implements Listable<T> {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource
  ) {}

  async list(
    params: IListParams,
    options: TypeOrmListOptions<T> = {} as TypeOrmListOptions<T>
  ): Promise<PaginatedCollection<T>> {
    if (!options.entityType) {
      throw new Error(`"entityType" is required when listing TypeOrm-managed entities`);
    }

    const { entityType, fieldMap = {}, onFindOptions } = options;
    const limit = params.page.size;
    const offset = (params.page.number - 1) * limit;

    const where: FindOptionsWhere<T> = {};
    Object.entries(params.filter).forEach(([unmapped, value]) => {
      const field = (unmapped in fieldMap ? fieldMap[unmapped] : unmapped) as keyof T;
      let operator: FindOperator<unknown>;

      if (typeof value === 'string') {
        operator = ILike(`%${value}%`);
      } else if (typeof value === 'number') {
        operator = Equal(value);
      } else if (typeof value === 'boolean') {
        operator = Equal(value);
      } else if (value === null) {
        operator = IsNull();
      } else {
        throw new Error(
          `Unexpected value for field ${String(field)} (mapped from ${unmapped}): ${value}`
        );
      }

      // @ts-expect-error mapped field exists in entity
      where[field] = operator;
    });

    const findOptions: FindManyOptions<T> = {
      where,
      take: limit,
      skip: offset,
    };

    if (typeof onFindOptions === 'function') {
      onFindOptions(findOptions);
    }

    const repo = this.dataSource.getRepository<T>(entityType);
    const [entities, total] = await repo.findAndCount(findOptions);

    return {
      data: entities,
      meta: {
        number: params.page.number,
        requested_size: params.page.size,
        actual_size: entities.length,
        total,
      },
    };
  }
}
