export interface DomainEventHandler<T = unknown> {
  handle(payload: T): Promise<void>;
}

export interface DomainEventRetryOptions {
  /** Maximum number of retries after the initial attempt. Default: 2 */
  maxRetries?: number;
  /** Minimum backoff in milliseconds. Default: 0 */
  minBackoffMs?: number;
  /** Maximum backoff in milliseconds. Default: 100 */
  maxBackoffMs?: number;
}

export interface OnDomainEventOptions {
  /** Retry configuration. Set to false to disable retries. Default: { maxRetries: 2, minBackoffMs: 0, maxBackoffMs: 100 } */
  retry?: DomainEventRetryOptions | false;
}
