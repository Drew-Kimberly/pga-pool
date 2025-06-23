import { IS_PUBLIC_KEY } from '../guards/jwt-auth.guard';

import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
