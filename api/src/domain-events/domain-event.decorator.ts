import { OnDomainEventOptions } from './domain-event.interface';

import { Injectable } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

export interface OnDomainEventMetadataValue {
  event: string;
  options: OnDomainEventOptions;
}

export const OnDomainEventMetadata = DiscoveryService.createDecorator<OnDomainEventMetadataValue>();

export const OnDomainEvent = Object.assign(
  (event: string, options: OnDomainEventOptions = {}): ClassDecorator =>
    (target) => {
      Injectable()(target);
      (OnDomainEventMetadata({ event, options }) as ClassDecorator)(target);
    },
  { KEY: OnDomainEventMetadata.KEY }
);
