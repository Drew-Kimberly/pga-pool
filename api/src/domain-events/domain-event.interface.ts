export interface DomainEventHandler<T = unknown> {
  handle(payload: T): Promise<void>;
}
