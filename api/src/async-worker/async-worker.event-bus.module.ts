import { AsyncWorkerEventBus } from './async-worker.event-bus';

import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [AsyncWorkerEventBus],
  exports: [AsyncWorkerEventBus],
})
export class AsyncWorkerEventBusModule {}
