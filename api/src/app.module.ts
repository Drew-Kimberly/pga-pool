import { HealthApiModule } from './health/api/health.api.module';
import { PgaPlayer } from './pga-player/lib/pga-player.entity';
import { PgaTournament } from './pga-tournament/lib/pga-tournament.entity';
import { UserModule } from './user/lib/user.module';
import { DatabaseModule } from './database';

import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule.register([PgaPlayer, PgaTournament]), HealthApiModule, UserModule],
})
export class AppModule {}
