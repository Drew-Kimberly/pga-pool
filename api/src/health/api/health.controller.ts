import { Public } from '../../auth/decorators/public.decorator';

import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Public()
  @Get('/up')
  up() {
    return 'OK';
  }
}
