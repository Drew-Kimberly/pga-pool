import { ListModule } from '../../common/api/list';
import { PgaPlayerModule } from '../lib/pga-player.module';

import { PgaPlayerController } from './pga-player.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [PgaPlayerModule, ListModule],
  controllers: [PgaPlayerController],
})
export class PgaPlayerApiModule {}
