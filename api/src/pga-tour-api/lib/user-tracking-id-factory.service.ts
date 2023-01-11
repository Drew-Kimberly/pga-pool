import { Cache } from 'cache-manager';
import jwt from 'jsonwebtoken';
import { lastValueFrom } from 'rxjs';
import { VM } from 'vm2';

import { InjectPgaTourApiConfig, IPgaTourApiConfig } from './pga-tour-api.config';

import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Inject, Injectable, Logger, LoggerService, Optional } from '@nestjs/common';

@Injectable()
export class UserTrackingIdFactory {
  constructor(
    private readonly httpClient: HttpService,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
    @InjectPgaTourApiConfig()
    private readonly pgaTourApiConfig: IPgaTourApiConfig,
    @Optional()
    private readonly logger: LoggerService = new Logger(UserTrackingIdFactory.name)
  ) {}

  async create(): Promise<{ userTrackingId: string }> {
    const remoteUrl = this.pgaTourApiConfig.USER_TRACKING_ID_SCRIPT_URL;
    const userTrackingId = await this.getUserTrackingId(remoteUrl);

    return { userTrackingId };
  }

  private async getUserTrackingId(remoteScriptUrl: string): Promise<string | never> {
    const cacheHit = await this.cache.get<string>(this.getCacheKey());
    if (cacheHit) {
      this.logger.log('Using cached userTrackingId');
      return cacheHit;
    }

    const script = await this.getRemoteScript(remoteScriptUrl);

    this.logger.log(
      `Securely executing userTrackingId generator script fetched from ${remoteScriptUrl}`
    );

    const userTrackingId = await this.executeScript(this.prepareScript(script));
    const parsed = this.validateUserTrackingId(userTrackingId);

    await this.cache.set(this.getCacheKey(), userTrackingId, (parsed.exp as number) - 60);

    return userTrackingId;
  }

  private validateUserTrackingId(userTrackingId: unknown) {
    if (typeof userTrackingId !== 'string') {
      throw new Error(`Unexpected userTrackingId value type: ${userTrackingId}`);
    }

    const decoded = jwt.decode(userTrackingId, { json: true });

    if (!decoded) {
      throw new Error(`Invalid userTrackingId: ${userTrackingId}`);
    }

    return decoded;
  }

  private executeScript(script: string) {
    const sandbox = new VM();

    return sandbox.run(script);
  }

  private getRemoteScript(url: string) {
    const response$ = this.httpClient.get<string>(url);
    return lastValueFrom(response$).then((res) => res.data);
  }

  private prepareScript(script: string): string {
    return (
      'window={};' +
      script +
      `window.pgatour.setTrackingUserId('${this.pgaTourApiConfig.USER_ID}');`
    );
  }

  private getCacheKey() {
    return `${UserTrackingIdFactory.name}-${this.pgaTourApiConfig.USER_ID}-userTrackingId`;
  }
}
