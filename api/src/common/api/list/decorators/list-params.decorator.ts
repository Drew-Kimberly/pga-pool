import { LIST_PARAMS_REQUEST_KEY } from '../list.constants';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ListParams = createParamDecorator((_, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest()[LIST_PARAMS_REQUEST_KEY];
});
