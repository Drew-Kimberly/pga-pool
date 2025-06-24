import { DataSource, Repository } from 'typeorm';

import { LeagueUser } from '../../league-user/lib/league-user.entity';
import { LeagueUserService } from '../../league-user/lib/league-user.service';
import { User } from '../../user/lib/user.entity';
import { UserService } from '../../user/lib/user.service';

import { Injectable, Logger, LoggerService, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

interface Auth0User {
  auth0Id: string;
  email?: string;
  name?: string;
  nickname?: string;
  picture?: string;
  provider: string;
}

@Injectable()
export class UserSyncService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(LeagueUser)
    private leagueUserRepo: Repository<LeagueUser>,
    private userService: UserService,
    private leagueUserService: LeagueUserService,
    private dataSource: DataSource,
    @Optional()
    private logger: LoggerService = new Logger(UserSyncService.name),
  ) {}

  async syncOrCreateUser(auth0User: Auth0User) {
    return await this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const leagueUserRepo = manager.getRepository(LeagueUser);

      // Try to find user by auth0Id
      let user = await userRepo.findOne({
        where: { auth0_id: auth0User.auth0Id },
      });

      if (!user && auth0User.email) {
        // Try to find by email for existing users
        user = await userRepo.findOne({
          where: { email: auth0User.email },
        });

        if (user) {
          // Link existing user to Auth0
          await userRepo.update(user.id, {
            auth0_id: auth0User.auth0Id,
            picture_url: auth0User.picture || null,
            auth_provider: auth0User.provider,
            last_login: new Date(),
          });
          // Reload user to get updated data
          user = await userRepo.findOne({ where: { id: user.id } });
          if (user) {
            this.logger?.log(`Linked existing user ${user.id} to Auth0 ID ${auth0User.auth0Id}`);
          }
        }
      }

      if (!user) {
        // Create new user
        const newUser = userRepo.create({
          auth0_id: auth0User.auth0Id,
          email: auth0User.email || null,
          name: auth0User.name || auth0User.email || 'Unknown User',
          nickname: auth0User.nickname || null,
          picture_url: auth0User.picture || null,
          auth_provider: auth0User.provider,
          last_login: new Date(),
          is_admin: false,
        });
        user = await userRepo.save(newUser);
        this.logger?.log(`Created new user ${user.id} for Auth0 ID ${auth0User.auth0Id}`);
      } else {
        // Update last login
        await userRepo.update(user.id, {
          last_login: new Date(),
        });
      }

      // Get user's leagues with related league data
      const leagues = await leagueUserRepo.find({
        where: { user_id: user.id },
        relations: ['league'],
      });

      return { user, leagues };
    });
  }
}
