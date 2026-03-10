import { DEFAULT_JITTER_FACTOR } from './async-worker.constants';
import { AsyncWorker, AsyncWorkerMetadata } from './async-worker.decorator';
import { AsyncWorkerHandler, AsyncWorkerOptions } from './async-worker.interface';

import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

export interface RegisteredWorker {
  instance: AsyncWorkerHandler;
  options: Required<AsyncWorkerOptions>;
  name: string;
}

@Injectable()
export class AsyncWorkerRegistry implements OnModuleInit {
  private readonly workers = new Map<string, RegisteredWorker>();

  constructor(private readonly discovery: DiscoveryService) {}

  onModuleInit(): void {
    this.discoverWorkers();
  }

  getWorkers(): ReadonlyMap<string, RegisteredWorker> {
    return this.workers;
  }

  private discoverWorkers(): void {
    const providers = this.discovery.getProviders({
      metadataKey: AsyncWorker.KEY,
    });

    for (const wrapper of providers) {
      if (!wrapper.instance || wrapper.isNotMetatype) continue;

      const metadata = this.discovery.getMetadataByDecorator(AsyncWorkerMetadata, wrapper);
      if (!metadata) continue;

      const instance = wrapper.instance as AsyncWorkerHandler;
      if (typeof instance.run !== 'function') {
        throw new Error(
          `@AsyncWorker() class "${wrapper.name}" must implement AsyncWorkerHandler (missing run() method)`
        );
      }

      if (this.workers.has(wrapper.name)) {
        throw new Error(
          `Duplicate @AsyncWorker() registration: "${wrapper.name}" is already registered`
        );
      }

      this.workers.set(wrapper.name, {
        instance,
        options: {
          interval: metadata.interval,
          jitter: metadata.jitter ?? DEFAULT_JITTER_FACTOR,
          scope: metadata.scope ?? 'global',
          retry: metadata.retry ?? {},
        },
        name: wrapper.name,
      });
    }
  }
}
