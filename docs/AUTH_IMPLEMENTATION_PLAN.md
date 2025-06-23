# Auth0 Authentication Implementation Plan

## Overview
This document outlines the implementation of Auth0 authentication for the PGA Pool application, supporting social login via Facebook and Google with JWT tokens scoped to leagues.

## Phase 1: Auth0 Setup and Configuration

### 1.1 Auth0 Tenant Configuration
```javascript
// Auth0 Application Settings
{
  "name": "PGA Pool",
  "type": "Single Page Application",
  "allowed_callback_urls": [
    "http://localhost:3001/post-login",
    "https://pga-pool.drewk.dev/post-login"
  ],
  "allowed_logout_urls": [
    "http://localhost:3001",
    "https://pga-pool.drewk.dev"
  ],
  "allowed_web_origins": [
    "http://localhost:3001",
    "https://pga-pool.drewk.dev"
  ],
  "cors_allowed_origins": [
    "http://localhost:3001",
    "https://pga-pool.drewk.dev"
  ]
}
```

### 1.2 Social Connections
- Enable Google OAuth2
- Enable Facebook Login
- Disable username/password authentication

### 1.3 Auth0 Action for League Claims
```javascript
// Auth0 Action: Add League Claims to Token
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://pga-pool.drewk.dev/';
  
  // Get user's league memberships from app metadata
  const leagues = event.user.app_metadata.leagues || [];
  const activeLeagueId = event.user.app_metadata.active_league_id;
  
  // Add custom claims to ID token and Access token
  api.idToken.setCustomClaim(`${namespace}leagues`, leagues);
  api.accessToken.setCustomClaim(`${namespace}leagues`, leagues);
  
  if (activeLeagueId) {
    api.idToken.setCustomClaim(`${namespace}league_id`, activeLeagueId);
    api.accessToken.setCustomClaim(`${namespace}league_id`, activeLeagueId);
  }
};
```

## Phase 2: Database Schema Changes

### 2.1 User Table Modifications
```sql
-- Add Auth0 fields to user table
ALTER TABLE "user" 
ADD COLUMN auth0_id VARCHAR(255) UNIQUE,
ADD COLUMN picture_url TEXT,
ADD COLUMN last_login TIMESTAMP,
ADD COLUMN auth_provider VARCHAR(50); -- 'google' or 'facebook'

-- Create index for auth0_id lookups
CREATE INDEX idx_user_auth0_id ON "user"(auth0_id);
```

### 2.2 Database Migration
```typescript
// Migration: 2024-01-XX-AddAuth0Fields.ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAuth0Fields1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user" 
      ADD COLUMN auth0_id VARCHAR(255) UNIQUE,
      ADD COLUMN picture_url TEXT,
      ADD COLUMN last_login TIMESTAMP,
      ADD COLUMN auth_provider VARCHAR(50)
    `);
    
    await queryRunner.query(`
      CREATE INDEX idx_user_auth0_id ON "user"(auth0_id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX idx_user_auth0_id`);
    await queryRunner.query(`
      ALTER TABLE "user" 
      DROP COLUMN auth0_id,
      DROP COLUMN picture_url,
      DROP COLUMN last_login,
      DROP COLUMN auth_provider
    `);
  }
}
```

## Phase 3: API Implementation

### 3.1 Auth Module Structure
```
api/src/auth/
├── auth.module.ts
├── auth.config.ts
├── strategies/
│   └── jwt.strategy.ts
├── guards/
│   ├── jwt-auth.guard.ts
│   ├── league.guard.ts
│   └── optional-auth.guard.ts
├── decorators/
│   ├── current-user.decorator.ts
│   ├── league.decorator.ts
│   └── public.decorator.ts
├── services/
│   ├── auth.service.ts
│   └── user-sync.service.ts
└── dto/
    └── auth-user.dto.ts
```

### 3.2 JWT Strategy Implementation
```typescript
// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${configService.get('AUTH0_DOMAIN')}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.get('AUTH0_AUDIENCE'),
      issuer: `https://${configService.get('AUTH0_DOMAIN')}/`,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    const namespace = 'https://pga-pool.drewk.dev/';
    return {
      auth0Id: payload.sub,
      email: payload.email,
      leagues: payload[`${namespace}leagues`] || [],
      leagueId: payload[`${namespace}league_id`],
    };
  }
}
```

### 3.3 Guards Implementation
```typescript
// jwt-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}

// league.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class LeagueGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const leagueId = request.params.leagueId || request.body.leagueId;

    if (!user.leagueId || user.leagueId !== leagueId) {
      throw new ForbiddenException('Access denied to this league');
    }

    return true;
  }
}
```

### 3.4 User Sync Service
```typescript
// user-sync.service.ts
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/lib/user.service';
import { LeagueUserService } from '../league-user/lib/league-user.service';

@Injectable()
export class UserSyncService {
  constructor(
    private userService: UserService,
    private leagueUserService: LeagueUserService,
  ) {}

  async syncOrCreateUser(auth0User: any) {
    // Try to find user by auth0Id
    let user = await this.userService.findByAuth0Id(auth0User.auth0Id);
    
    if (!user && auth0User.email) {
      // Try to find by email for existing users
      user = await this.userService.findByEmail(auth0User.email);
      
      if (user) {
        // Link existing user to Auth0
        await this.userService.update(user.id, {
          auth0_id: auth0User.auth0Id,
          picture_url: auth0User.picture,
          auth_provider: auth0User.provider,
          last_login: new Date(),
        });
      }
    }
    
    if (!user) {
      // Create new user
      user = await this.userService.create({
        auth0_id: auth0User.auth0Id,
        email: auth0User.email,
        name: auth0User.name,
        nickname: auth0User.nickname,
        picture_url: auth0User.picture,
        auth_provider: auth0User.provider,
        last_login: new Date(),
      });
    }
    
    // Get user's leagues
    const leagues = await this.leagueUserService.getUserLeagues(user.id);
    
    return { user, leagues };
  }
}
```

### 3.5 Auth Module Configuration
```typescript
// auth.module.ts
import { Module, Global } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LeagueGuard } from './guards/league.guard';
import { AuthService } from './services/auth.service';
import { UserSyncService } from './services/user-sync.service';
import { UserModule } from '../user/lib/user.module';
import { LeagueUserModule } from '../league-user/lib/league-user.module';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
    LeagueUserModule,
  ],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    LeagueGuard,
    AuthService,
    UserSyncService,
  ],
  exports: [JwtAuthGuard, LeagueGuard, AuthService, UserSyncService],
})
export class AuthModule {}
```

## Phase 4: API Endpoint Updates

### 4.1 Update Main Application
```typescript
// main.ts updates
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS with Auth0 domains
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'https://pga-pool.drewk.dev',
      /^https:\/\/.*\.auth0\.com$/,
    ],
    credentials: true,
  });
  
  // Global JWT guard (with @Public() decorator for open endpoints)
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  
  await app.listen(3000);
}
```

### 4.2 Update Controllers
```typescript
// Example: pool-tournament.controller.ts
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { LeagueGuard } from '../../auth/guards/league.guard';

@Controller('pools/:poolId/tournaments')
export class PoolTournamentController {
  @Get()
  @UseGuards(LeagueGuard)
  async list(
    @Param('poolId') poolId: string,
    @CurrentUser() user: any,
  ) {
    // User's leagueId is automatically validated by LeagueGuard
    return this.poolTournamentService.list({ poolId });
  }
}
```

## Phase 5: Client Implementation

### 5.1 Install Dependencies
```bash
cd client
yarn add @auth0/auth0-react axios
```

### 5.2 Auth0 Provider Setup
```typescript
// index.tsx
import { Auth0Provider } from '@auth0/auth0-react';

const auth0Config = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN!,
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID!,
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  redirectUri: window.location.origin + '/callback',
  useRefreshTokens: true,
  cacheLocation: 'localstorage',
};

root.render(
  <Auth0Provider {...auth0Config}>
    <App />
  </Auth0Provider>
);
```

### 5.3 Protected Route Component
```typescript
// components/ProtectedRoute.tsx
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import { Spinner } from '../Spinner';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    loginWithRedirect();
    return null;
  }

  return <>{children}</>;
};
```

### 5.4 API Client with Auth
```typescript
// api/client.ts
import axios from 'axios';
import { getAuth0Token } from './auth';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
});

// Add auth token to requests
apiClient.interceptors.request.use(async (config) => {
  try {
    const token = await getAuth0Token();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Failed to get auth token:', error);
  }
  return config;
});

export default apiClient;
```

### 5.5 League Selection Component
```typescript
// components/LeagueSelector.tsx
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, Select, Text } from 'grommet';

export const LeagueSelector: React.FC = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');

  useEffect(() => {
    // Get user's leagues from token claims
    const namespace = 'https://pga-pool.drewk.dev/';
    const userLeagues = user?.[`${namespace}leagues`] || [];
    setLeagues(userLeagues);
    
    // Auto-select if only one league
    if (userLeagues.length === 1) {
      handleLeagueSelect(userLeagues[0].id);
    }
  }, [user]);

  const handleLeagueSelect = async (leagueId: string) => {
    // Update Auth0 user metadata
    const token = await getAccessTokenSilently();
    await updateUserMetadata(token, { active_league_id: leagueId });
    
    // Refresh token to get new claims
    window.location.reload();
  };

  if (leagues.length === 0) {
    return <Text>No leagues available. Please contact an administrator.</Text>;
  }

  if (leagues.length === 1) {
    return null; // Auto-selected
  }

  return (
    <Box pad="medium">
      <Text>Select your league:</Text>
      <Select
        options={leagues}
        labelKey="name"
        valueKey="id"
        value={selectedLeague}
        onChange={({ option }) => handleLeagueSelect(option.id)}
      />
    </Box>
  );
};
```

## Phase 6: Migration Strategy

### 6.1 CLI Command for User Linking
```typescript
// cli/users/commands/linkAuth0Command.ts
export const linkAuth0Command = new Command('link-auth0')
  .description('Link existing users to Auth0')
  .option('-e, --email <email>', 'User email to link')
  .option('-a, --auth0-id <id>', 'Auth0 ID')
  .action(async (options) => {
    const user = await userService.findByEmail(options.email);
    if (!user) {
      console.error('User not found');
      return;
    }
    
    await userService.update(user.id, {
      auth0_id: options.auth0Id,
    });
    
    console.log(`Linked user ${user.email} to Auth0 ID ${options.auth0Id}`);
  });
```

### 6.2 Feature Flag for Gradual Rollout
```typescript
// config/feature-flags.ts
export const featureFlags = {
  AUTH_ENABLED: process.env.AUTH_ENABLED === 'true',
  AUTH_REQUIRED: process.env.AUTH_REQUIRED === 'true', // Enforce auth
};

// In guards
if (!featureFlags.AUTH_ENABLED) {
  return true; // Skip auth check
}
```

## Phase 7: Environment Configuration

### 7.1 API Environment Variables
```bash
# .env additions
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://api.pga-pool.drewk.dev
AUTH_ENABLED=true
AUTH_REQUIRED=false # Set to true to enforce
```

### 7.2 Client Environment Variables
```bash
# .env additions
REACT_APP_AUTH0_DOMAIN=your-tenant.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your-client-id
REACT_APP_AUTH0_AUDIENCE=https://api.pga-pool.drewk.dev
```

## Security Considerations

1. **JWT Validation**: Always validate JWTs on the server side
2. **League Isolation**: Ensure users can only access their assigned leagues
3. **Rate Limiting**: Implement rate limiting on auth endpoints
4. **Token Expiry**: Use short-lived tokens with refresh tokens
5. **CORS**: Restrict CORS to known domains only
6. **Audit Logging**: Log all authentication events

## Testing Strategy

1. **Unit Tests**: Test guards, strategies, and services
2. **Integration Tests**: Test full auth flow
3. **E2E Tests**: Test login flow with real Auth0 sandbox
4. **Security Tests**: Test unauthorized access attempts
5. **Migration Tests**: Test user linking scenarios