import { DomainEventRegistry } from './domain-event.registry';
import { DomainEventBus } from './domain-event-bus';

import { Global, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [DomainEventBus, DomainEventRegistry],
  exports: [DomainEventBus],
})
export class DomainEventModule {}
