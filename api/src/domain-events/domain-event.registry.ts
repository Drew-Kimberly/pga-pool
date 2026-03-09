import { OnDomainEvent } from './domain-event.decorator';
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

      const event = this.discovery.getMetadataByDecorator(OnDomainEvent, wrapper);
      if (!event) continue;

      const instance = wrapper.instance as DomainEventHandler;
      if (typeof instance.handle !== 'function') {
        throw new Error(
          `@OnDomainEvent() class "${wrapper.name}" must implement DomainEventHandler (missing handle() method)`
        );
      }

      this.handlers.push({ instance, event, name: wrapper.name });

      this.eventBus.on(event as Parameters<typeof this.eventBus.on>[0], async (payload) => {
        try {
          await instance.handle(payload);
        } catch (error) {
          this.logger.error(
            `Event handler "${wrapper.name}" failed for "${event}": ${error}`,
            error instanceof Error ? error.stack : undefined
          );
        }
      });

      this.logger.log(`Wired event handler "${wrapper.name}" → "${event}"`);
    }

    this.logger.log(`Discovered and wired ${this.handlers.length} domain event handler(s)`);
  }
}
