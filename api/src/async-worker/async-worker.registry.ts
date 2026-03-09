import { DEFAULT_JITTER_FACTOR } from './async-worker.constants';
import { AsyncWorker, OnAsyncEvent } from './async-worker.decorator';
import {
  AsyncEventHandler,
  AsyncWorkerHandler,
  AsyncWorkerOptions,
} from './async-worker.interface';

import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

export interface RegisteredWorker {
  instance: AsyncWorkerHandler;
  options: Required<AsyncWorkerOptions>;
  name: string;
}

export interface RegisteredEventHandler {
  instance: AsyncEventHandler;
  event: string;
  name: string;
}

@Injectable()
export class AsyncWorkerRegistry implements OnModuleInit {
  private readonly workers: RegisteredWorker[] = [];
  private readonly eventHandlers: RegisteredEventHandler[] = [];

  constructor(private readonly discovery: DiscoveryService) {}

  onModuleInit(): void {
    this.discoverWorkers();
    this.discoverEventHandlers();
  }

  getWorkers(): ReadonlyArray<RegisteredWorker> {
    return this.workers;
  }

  getEventHandlers(): ReadonlyArray<RegisteredEventHandler> {
    return this.eventHandlers;
  }

  private discoverWorkers(): void {
    const providers = this.discovery.getProviders({
      metadataKey: AsyncWorker.KEY,
    });

    for (const wrapper of providers) {
      if (!wrapper.instance || wrapper.isNotMetatype) continue;

      const metadata = this.discovery.getMetadataByDecorator(AsyncWorker, wrapper);
      if (!metadata) continue;

      const instance = wrapper.instance as AsyncWorkerHandler;
      if (typeof instance.run !== 'function') {
        throw new Error(
          `@AsyncWorker() class "${wrapper.name}" must implement AsyncWorkerHandler (missing run() method)`
        );
      }

      this.workers.push({
        instance,
        options: {
          interval: metadata.interval,
          jitter: metadata.jitter ?? DEFAULT_JITTER_FACTOR,
          scope: metadata.scope ?? 'global',
        },
        name: wrapper.name,
      });
    }
  }

  private discoverEventHandlers(): void {
    const providers = this.discovery.getProviders({
      metadataKey: OnAsyncEvent.KEY,
    });

    for (const wrapper of providers) {
      if (!wrapper.instance || wrapper.isNotMetatype) continue;

      const event = this.discovery.getMetadataByDecorator(OnAsyncEvent, wrapper);
      if (!event) continue;

      const instance = wrapper.instance as AsyncEventHandler;
      if (typeof instance.handle !== 'function') {
        throw new Error(
          `@OnAsyncEvent() class "${wrapper.name}" must implement AsyncEventHandler (missing handle() method)`
        );
      }

      this.eventHandlers.push({
        instance,
        event,
        name: wrapper.name,
      });
    }
  }
}
