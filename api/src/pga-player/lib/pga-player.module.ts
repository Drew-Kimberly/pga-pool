import { PgaPlayer } from './pga-player.entity';
import { PgaPlayerService } from './pga-player.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PgaPlayer])],
  providers: [PgaPlayerService],
  exports: [PgaPlayerService],
})
export class PgaPlayerModule {}
