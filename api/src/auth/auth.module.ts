import { Module, Global } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserModule } from '../user/lib/user.module';
import { User } from '../user/lib/user.entity';
import { LeagueUserModule } from '../league-user/lib/league-user.module';
import { LeagueUser } from '../league-user/lib/league-user.entity';
import { UserSyncService } from './services/user-sync.service';
import { AuthController } from './auth.controller';

@Global()
@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User, LeagueUser]),
    UserModule,
    LeagueUserModule,
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    UserSyncService,
  ],
  exports: [
    JwtAuthGuard,
    UserSyncService,
  ],
})
export class AuthModule {}