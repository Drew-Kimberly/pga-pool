import { Request } from 'express';

import { isObject } from '../../util';

import { LIST_OPTIONS, LIST_PARAMS_REQUEST_KEY } from './list.constants';
import { InvalidatedListParams, MergedListOptions } from './list.interface';
import { SCHEMA_REGISTRY } from './schema';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ListGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean | never {
    const listOptions = this.reflector.get<MergedListOptions>(LIST_OPTIONS, ctx.getHandler());

    if (!listOptions) {
      // Not listable route (not decorated with @List())
      return true;
    }

    const request = ctx.switchToHttp().getRequest<Request>();
    const controllerName = ctx.getClass().name;
    const routeName = ctx.getHandler().name;

    const schema = SCHEMA_REGISTRY.get(controllerName, routeName);

    if (!schema) {
      throw new Error(
        `List Params schema not found for controller ${controllerName} and route handler ${routeName}`
      );
    }

    const rawListParams: InvalidatedListParams = {
      page: this.getRawPageQuery(request),
    };

    const validationResult = schema.validate(rawListParams);
    if (validationResult.error) {
      throw validationResult.error;
    }

    // @ts-expect-error setting context on Express req object.
    request[LIST_PARAMS_REQUEST_KEY] = validationResult.value;

    return true;
  }

  private getRawPageQuery(req: Request): InvalidatedListParams['page'] {
    return isObject(req.query.page) ? req.query.page : {};
  }
}
