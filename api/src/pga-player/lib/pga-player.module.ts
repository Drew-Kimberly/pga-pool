import { PgaPlayerService } from './pga-player.service';

import { Module } from '@nestjs/common';

@Module({
  providers: [PgaPlayerService],
  exports: [PgaPlayerService],
})
export class PgaPlayerModule {}
