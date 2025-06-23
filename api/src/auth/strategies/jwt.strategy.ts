import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { UserSyncService } from '../services/user-sync.service';

interface JwtPayload {
  sub: string; // Auth0 user ID
  email?: string;
  name?: string;
  nickname?: string;
  picture?: string;
  'https://pga-pool.drewk.dev/leagues'?: Array<{ id: string; name: string }>;
  'https://pga-pool.drewk.dev/league_id'?: string;
  iat: number;
  exp: number;
  azp: string;
  aud: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userSyncService: UserSyncService,
  ) {
    const domain = configService.get('AUTH0_DOMAIN');
    const audience = configService.get('AUTH0_AUDIENCE');
    
    console.log('JWT Strategy Configuration:', {
      domain,
      audience,
      jwksUri: `https://${domain}/.well-known/jwks.json`,
      issuer: `https://${domain}/`,
    });
    
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
  }

  async validate(payload: JwtPayload) {
    console.log('JWT Validation - Payload:', JSON.stringify(payload, null, 2));
    
    const namespace = 'https://pga-pool.drewk.dev/';
    
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
    const tokenLeagues = payload[`${namespace}leagues`] || [];
    const activeLeagueId = payload[`${namespace}league_id`];

    // Validate league access if activeLeagueId is present
    if (activeLeagueId) {
      const hasAccess = leagues.some((league: any) => league.league_id === activeLeagueId);
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
      leagues: leagues.map((lu: any) => ({
        id: lu.league_id,
        name: lu.league.name,
        isOwner: lu.is_owner,
      })),
    };
  }
}