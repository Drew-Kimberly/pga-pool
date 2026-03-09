import { AsyncWorkerOptions } from './async-worker.interface';

import { DiscoveryService } from '@nestjs/core';

export const AsyncWorker = DiscoveryService.createDecorator<AsyncWorkerOptions>();
