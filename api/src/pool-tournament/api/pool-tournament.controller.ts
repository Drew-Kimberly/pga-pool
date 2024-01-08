import { ControllerBase } from '../../common/api';
import { PgaPlayerDto } from '../../pga-player/api/pga-player.dto';
import { PgaPlayer } from '../../pga-player/lib/pga-player.entity';
import { PgaTournamentDto } from '../../pga-tournament/api/pga-tournament.dto';
import { PgaTournamentService } from '../../pga-tournament/lib/pga-tournament.service';
import { PlayerStatus } from '../../pga-tournament-player/lib/pga-tournament-player.interface';
import { PoolUserDto } from '../../pool-user/api/pool-user.dto';
import { PoolUser } from '../../pool-user/lib/pool-user.entity';
import { PoolUserPickDto } from '../../pool-user-pick/api/pool-user-pick.dto';
import { PoolUserPick } from '../../pool-user-pick/lib/pool-user-pick.entity';
import { UserDto } from '../../user/api/user.dto';
import { User } from '../../user/lib/user.entity';
import { PoolTournament } from '../lib/pool-tournament.entity';
import { PoolTournamentService } from '../lib/pool-tournament.service';

import { PoolTournamentDto } from './pool-tournament.dto';

import {
  Controller,
  Get,
  Logger,
  LoggerService,
  NotFoundException,
  Optional,
  Param,
} from '@nestjs/common';

export const CURRENT_TOURNAMENT = 'current';

@Controller('pool/tournaments')
export class PoolTournamentController extends ControllerBase {
  constructor(
    private readonly poolTournamentService: PoolTournamentService,
    private readonly pgaTournamentService: PgaTournamentService,
    @Optional()
    protected readonly logger: LoggerService = new Logger(PoolTournamentController.name)
  ) {
    super(logger);
  }

  @Get()
  async listTournaments(): Promise<{ data: PoolTournamentDto[] }> {
    this.logger.log('Listing pool tournaments');

    let poolTournaments: PoolTournament[];
    try {
      poolTournaments = await this.poolTournamentService.list();
    } catch (e) {
      this.logErrorSkipping4xx(e, `Error listing pool tournaments: ${e}`);
      throw e;
    }

    return { data: poolTournaments.map(this.toPoolTournamentDto.bind(this)) };
  }

  @Get('/:poolTournamentId')
  async getTournament(@Param('poolTournamentId') poolTournamentId: string) {
    this.logger.log(`Getting pool tournament (ID: ${poolTournamentId})`);

    let poolTournament: PoolTournament | null;

    try {
      if (poolTournamentId === CURRENT_TOURNAMENT) {
        const currentPgaTourney = await this.pgaTournamentService.getCurrent();
        if (!currentPgaTourney) {
          throw new NotFoundException('There is currently no in-progress PGA tournament');
        }

        poolTournament = (
          await this.poolTournamentService.list({
            pgaTournamentId: currentPgaTourney.id,
          })
        )[0];
      } else {
        poolTournament = await this.poolTournamentService.get(poolTournamentId);
      }
    } catch (e) {
      this.logErrorSkipping4xx(e, `Error fetching pool tournament (ID: ${poolTournamentId}): ${e}`);
      throw e;
    }

    if (!poolTournament) {
      throw new NotFoundException(`Pool Tournament (ID: ${poolTournamentId}) not found`);
    }

    return this.toPoolTournamentDto(poolTournament);
  }

  private toPoolTournamentDto(tourney: PoolTournament): PoolTournamentDto {
    return {
      id: tourney.id,
      active: tourney.active,
      pga_tournament: PgaTournamentDto.fromEntity(tourney.pga_tournament),
      pool_users: tourney.pool_users.map(this.toPoolUserDto.bind(this)),
    };
  }

  private toPoolUserDto(poolUser: PoolUser): PoolUserDto {
    return {
      id: poolUser.id,
      score: poolUser.score,
      projected_fedex_cup_points:
        typeof poolUser.score === 'number' ? poolUser.projected_fedex_cup_points : null,
      user: this.toUserDto(poolUser.user),
      picks: poolUser.picks.map(this.toPoolUserPickDto.bind(this)),
    };
  }

  private toPoolUserPickDto(pick: PoolUserPick): PoolUserPickDto {
    const player = pick.pool_tournament_player.pga_tournament_player;

    return {
      tier: pick.pool_tournament_player.tier,
      id: pick.id,
      active: player.active,
      current_hole: player.current_hole,
      current_position: player.current_position,
      current_round: player.current_round,
      is_round_complete: player.is_round_complete,
      pga_player: this.toPgaPlayerDto(player.pga_player),
      pga_tournament: PgaTournamentDto.fromEntity(player.pga_tournament),
      score_thru: player.score_thru,
      score_total: player.score_total,
      projected_fedex_cup_points: player.projected_fedex_cup_points,
      starting_hole: player.starting_hole,
      status: player.status,
      tee_time: player.tee_time,
      withdrawn: player.status === PlayerStatus.Withdrawn,
    };
  }

  private toPgaPlayerDto(player: PgaPlayer): PgaPlayerDto {
    return {
      id: player.id,
      name: player.name,
    };
  }

  private toUserDto(user: User): UserDto {
    return {
      id: user.id,
      name: user.name,
      nickname: user.nickname,
    };
  }
}
