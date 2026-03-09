import { DiscoveryService } from '@nestjs/core';

export const OnDomainEvent = DiscoveryService.createDecorator<string>();
