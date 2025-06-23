import { LeagueUser } from '../league-user/lib/league-user.entity';
import { LeagueUserModule } from '../league-user/lib/league-user.module';
import { User } from '../user/lib/user.entity';
import { UserModule } from '../user/lib/user.module';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserSyncService } from './services/user-sync.service';
import { JwtStrategy } from './strategies/jwt.strategy';

import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User, LeagueUser]),
    UserModule,
    LeagueUserModule,
  ],
  providers: [JwtStrategy, JwtAuthGuard, UserSyncService],
  exports: [JwtAuthGuard, UserSyncService],
})
export class AuthModule {}
