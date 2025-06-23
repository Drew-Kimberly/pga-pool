import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserSyncService } from '../services/user-sync.service';

import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

interface JwtPayload {
  sub: string; // Auth0 user ID
  email?: string;
  name?: string;
  nickname?: string;
  picture?: string;
  league_id?: string;
  iat: number;
  exp: number;
  azp: string;
  aud: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger?: Logger;

  constructor(
    private configService: ConfigService,
    private userSyncService: UserSyncService,
    logger?: Logger
  ) {
    const domain = configService.get('AUTH0_DOMAIN');
    const audience = configService.get('AUTH0_AUDIENCE');

    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${domain}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience,
      issuer: `https://${domain}/`,
      algorithms: ['RS256'],
    });

    this.logger = logger;
    this.logger?.log(`JWT Strategy initialized with domain: ${domain}`);
  }

  async validate(payload: JwtPayload) {
    // Extract Auth0 user info
    const auth0User = {
      auth0Id: payload.sub,
      email: payload.email,
      name: payload.name,
      nickname: payload.nickname,
      picture: payload.picture,
      provider: payload.sub.split('|')[0], // e.g., 'google-oauth2', 'facebook'
    };

    // Sync or create user in our database
    const { user, leagues } = await this.userSyncService.syncOrCreateUser(auth0User);

    // Extract league information from token
    const activeLeagueId = payload.league_id;

    // Validate league access if activeLeagueId is present
    if (activeLeagueId) {
      const hasAccess = leagues.some((league) => league.league_id === activeLeagueId);
      if (!hasAccess) {
        throw new UnauthorizedException('Access denied to the specified league');
      }
    }

    // Return user context for requests
    return {
      userId: user.id,
      auth0Id: payload.sub,
      email: user.email,
      name: user.name,
      isAdmin: user.is_admin,
      leagueId: activeLeagueId,
      leagues: leagues.map((lu) => ({
        id: lu.league_id,
        name: lu.league.name,
        isOwner: lu.is_owner,
      })),
    };
  }
}
