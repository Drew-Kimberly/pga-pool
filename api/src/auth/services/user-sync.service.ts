import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../../user/lib/user.service';
import { User } from '../../user/lib/user.entity';
import { LeagueUserService } from '../../league-user/lib/league-user.service';
import { LeagueUser } from '../../league-user/lib/league-user.entity';

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
  ) {}

  async syncOrCreateUser(auth0User: Auth0User) {
    // Try to find user by auth0Id
    let user = await this.userRepo.findOne({ 
      where: { auth0_id: auth0User.auth0Id } 
    });
    
    if (!user && auth0User.email) {
      // Try to find by email for existing users
      user = await this.userRepo.findOne({ 
        where: { email: auth0User.email } 
      });
      
      if (user) {
        // Link existing user to Auth0
        await this.userService.update({
          id: user.id,
          auth0_id: auth0User.auth0Id,
          picture_url: auth0User.picture || null,
          auth_provider: auth0User.provider,
          last_login: new Date(),
        });
      }
    }
    
    if (!user) {
      // Create new user
      user = await this.userService.create({
        auth0_id: auth0User.auth0Id,
        email: auth0User.email || null,
        name: auth0User.name || auth0User.email || 'Unknown User',
        nickname: auth0User.nickname || null,
        picture_url: auth0User.picture || null,
        auth_provider: auth0User.provider,
        last_login: new Date(),
        is_admin: false,
      });
    } else {
      // Update last login
      await this.userService.update({
        id: user.id,
        last_login: new Date(),
      });
    }
    
    // Get user's leagues with related league data
    const leagues = await this.leagueUserRepo.find({
      where: { user_id: user.id },
      relations: ['league'],
    });
    
    return { user, leagues };
  }
}