import {
  OnDomainEvent,
  OnDomainEventMetadata,
  OnDomainEventMetadataValue,
} from './domain-event.decorator';
import { DomainEventHandler } from './domain-event.interface';
import { DomainEventBus } from './domain-event-bus';

import {
  Injectable,
  Logger,
  LoggerService,
  OnApplicationBootstrap,
  Optional,
} from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

interface RegisteredHandler {
  instance: DomainEventHandler;
  event: string;
  name: string;
}

@Injectable()
export class DomainEventRegistry implements OnApplicationBootstrap {
  private readonly handlers: RegisteredHandler[] = [];

  constructor(
    private readonly discovery: DiscoveryService,
    private readonly eventBus: DomainEventBus,
    @Optional()
    private readonly logger: LoggerService = new Logger(DomainEventRegistry.name)
  ) {}

  onApplicationBootstrap(): void {
    this.discoverAndWire();
  }

  private discoverAndWire(): void {
    const providers = this.discovery.getProviders({
      metadataKey: OnDomainEvent.KEY,
    });

    for (const wrapper of providers) {
      if (!wrapper.instance || wrapper.isNotMetatype) continue;

      const metadata: OnDomainEventMetadataValue | undefined =
        this.discovery.getMetadataByDecorator(OnDomainEventMetadata, wrapper);
      if (!metadata) continue;

      const { event, options } = metadata;

      const instance = wrapper.instance as DomainEventHandler;
      if (typeof instance.handle !== 'function') {
        throw new Error(
          `@OnDomainEvent() class "${wrapper.name}" must implement DomainEventHandler (missing handle() method)`
        );
      }

      this.handlers.push({ instance, event, name: wrapper.name });

      const retryConfig = options.retry;
      const maxAttempts = retryConfig === false ? 1 : 1 + (retryConfig?.maxRetries ?? 2);
      const minBackoff = retryConfig === false ? 0 : (retryConfig?.minBackoffMs ?? 0);
      const maxBackoff = retryConfig === false ? 0 : (retryConfig?.maxBackoffMs ?? 100);

      this.eventBus.on(event, async (payload: unknown) => {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          try {
            await instance.handle(payload);
            return;
          } catch (error) {
            if (attempt < maxAttempts) {
              const backoff = Math.round(minBackoff + Math.random() * (maxBackoff - minBackoff));
              this.logger.warn(
                `Event handler "${wrapper.name}" failed for "${event}" (attempt ${attempt}/${maxAttempts}), retrying in ${backoff}ms: ${error}`
              );
              await new Promise((resolve) => setTimeout(resolve, backoff));
            } else {
              this.logger.error(
                `Event handler "${wrapper.name}" failed for "${event}" after ${maxAttempts} attempt(s): ${error}`,
                error instanceof Error ? error.stack : undefined
              );
            }
          }
        }
      });

      this.logger.log(`Wired event handler "${wrapper.name}" → "${event}"`);
    }

    this.logger.log(`Discovered and wired ${this.handlers.length} domain event handler(s)`);
  }
}
