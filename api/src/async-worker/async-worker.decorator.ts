import { AsyncWorkerOptions } from './async-worker.interface';

import { Injectable } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

export const AsyncWorkerMetadata = DiscoveryService.createDecorator<AsyncWorkerOptions>();

export const AsyncWorker = Object.assign(
  (options: AsyncWorkerOptions): ClassDecorator =>
    (target) => {
      Injectable()(target);
      (AsyncWorkerMetadata(options) as ClassDecorator)(target);
    },
  { KEY: AsyncWorkerMetadata.KEY }
);
