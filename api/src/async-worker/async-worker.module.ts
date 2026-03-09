import { PgaTournamentModule } from '../pga-tournament/lib/pga-tournament.module';

import { AsyncWorkerRegistry } from './async-worker.registry';
import { AsyncWorkerScheduler } from './async-worker.scheduler';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryModule } from '@nestjs/core';

@Module({
  imports: [ConfigModule, DiscoveryModule, PgaTournamentModule],
  providers: [AsyncWorkerRegistry, AsyncWorkerScheduler],
})
export class AsyncWorkerModule {}
