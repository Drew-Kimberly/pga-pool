import {
  And,
  DataSource,
  Equal,
  FindManyOptions,
  FindOperator,
  FindOptionsWhere,
  ILike,
  IsNull,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  ObjectLiteral,
} from 'typeorm';

import { isObject } from '../../../util';
import {
  FilterOperators,
  FilterPrimitive,
  IListParams,
  Listable,
  PaginatedCollection,
} from '../list.interface';

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
      const operator = this.buildOperator(field, unmapped, value);

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

  private buildOperator(field: keyof T, unmapped: string, value: unknown): FindOperator<unknown> {
    if (isObject(value)) {
      return this.buildOperatorObject(field, unmapped, value as FilterOperators);
    }

    if (typeof value === 'string') {
      return Equal(value);
    }

    if (typeof value === 'number') {
      return Equal(value);
    }

    if (typeof value === 'boolean') {
      return Equal(value);
    }

    if (value === null) {
      return IsNull();
    }

    throw new Error(
      `Unexpected value for field ${String(field)} (mapped from ${unmapped}): ${value}`
    );
  }

  private buildOperatorObject(
    field: keyof T,
    unmapped: string,
    operators: FilterOperators
  ): FindOperator<unknown> {
    const entries = Object.entries(operators);
    if (entries.length === 0) {
      throw new Error(
        `Unexpected empty operator object for field ${String(field)} (mapped from ${unmapped})`
      );
    }

    const operatorInstances = entries.map(([operator, operand]) =>
      this.buildOperatorInstance(field, unmapped, operator, operand as FilterPrimitive)
    );

    if (operatorInstances.length === 1) {
      return operatorInstances[0];
    }

    return And(...operatorInstances);
  }

  private buildOperatorInstance(
    field: keyof T,
    unmapped: string,
    operator: string,
    operand: FilterPrimitive
  ): FindOperator<unknown> {
    if (operand === null) {
      if (operator === 'eq') {
        return IsNull();
      }

      if (operator === 'neq') {
        return Not(IsNull());
      }
    }

    switch (operator) {
      case 'eq':
        return Equal(operand);
      case 'neq':
        return Not(Equal(operand));
      case 'contains':
        return ILike(`%${operand}%`);
      case 'gt':
        return MoreThan(operand);
      case 'gte':
        return MoreThanOrEqual(operand);
      case 'lt':
        return LessThan(operand);
      case 'lte':
        return LessThanOrEqual(operand);
      default:
        throw new Error(
          `Unexpected operator for field ${String(field)} (mapped from ${unmapped}): ${operator}`
        );
    }
  }
}
