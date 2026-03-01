import { Repository } from 'typeorm';

import { HoleScoreStatus as GqlHoleScoreStatus } from '../../pga-tour-api/lib/v2/generated/graphql';
import { PgaTourApiService } from '../../pga-tour-api/lib/v2/pga-tour-api.service';
import { PgaTournament } from '../../pga-tournament/lib/pga-tournament.entity';
import { PgaTournamentPlayer } from '../../pga-tournament-player/lib/pga-tournament-player.entity';
import { PgaTournamentPlayerService } from '../../pga-tournament-player/lib/pga-tournament-player.service';

import { PgaTournamentPlayerHole } from './pga-tournament-player-hole.entity';
import { HoleScoreStatus, StrokeType } from './pga-tournament-player-hole.interface';
import { PgaTournamentPlayerStroke } from './pga-tournament-player-stroke.entity';

import { Injectable, Logger, LoggerService, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PgaTournamentPlayerHoleService {
  constructor(
    @InjectRepository(PgaTournamentPlayerHole)
    private readonly holeRepo: Repository<PgaTournamentPlayerHole>,
    @InjectRepository(PgaTournamentPlayerStroke)
    private readonly strokeRepo: Repository<PgaTournamentPlayerStroke>,
    private readonly pgaTourApi: PgaTourApiService,
    private readonly pgaTournamentPlayerService: PgaTournamentPlayerService,
    @Optional()
    private readonly logger: LoggerService = new Logger(PgaTournamentPlayerHoleService.name)
  ) {}

  async getRoundSummaries(
    pgaTournamentPlayerId: string
  ): Promise<{ round_number: number; strokes: number; to_par: number }[]> {
    const results = await this.holeRepo
      .createQueryBuilder('hole')
      .select('hole.round_number', 'round_number')
      .addSelect('SUM(hole.score)', 'strokes')
      .addSelect('SUM(hole.to_par)', 'to_par')
      .where('hole.pga_tournament_player_id = :id', { id: pgaTournamentPlayerId })
      .groupBy('hole.round_number')
      .orderBy('hole.round_number', 'ASC')
      .getRawMany<{ round_number: number; strokes: string; to_par: string }>();

    return results.map((r) => ({
      round_number: r.round_number,
      strokes: Number(r.strokes),
      to_par: Number(r.to_par),
    }));
  }

  async getScorecard(
    pgaTournamentPlayerId: string,
    round: number
  ): Promise<PgaTournamentPlayerHole[]> {
    return this.holeRepo.find({
      where: {
        pga_tournament_player_id: pgaTournamentPlayerId,
        round_number: round,
      },
      order: { hole_number: 'ASC' },
    });
  }

  async ingestHolesForRound(pgaTournamentId: string, round: number): Promise<void> {
    this.logger.log(`Ingesting hole data for tournament ${pgaTournamentId}, round ${round}`);

    const data = await this.pgaTourApi.getLeaderboardHoleByHole(pgaTournamentId, round);
    if (!data?.playerData?.length) {
      this.logger.warn(
        `No hole-by-hole data returned for tournament ${pgaTournamentId}, round ${round}`
      );
      return;
    }

    const holeRows: Partial<PgaTournamentPlayerHole>[] = [];

    for (const playerRow of data.playerData) {
      const pgaTournamentPlayerId = `${playerRow.playerId}-${pgaTournamentId}`;

      for (const holeScore of playerRow.scores) {
        const score = Number(holeScore.score);
        if (isNaN(score) || score === 0) {
          continue;
        }

        holeRows.push({
          pga_tournament_player_id: pgaTournamentPlayerId,
          round_number: round,
          hole_number: holeScore.holeNumber,
          par: holeScore.par,
          score,
          to_par: score - holeScore.par,
          status: this.mapHoleScoreStatus(holeScore.status),
          yardage: holeScore.yardage,
          sequence: holeScore.sequenceNumber,
        });
      }
    }

    if (holeRows.length === 0) {
      this.logger.log(`No valid hole scores to upsert for round ${round}`);
      return;
    }

    await this.holeRepo.upsert(holeRows, {
      conflictPaths: ['pga_tournament_player_id', 'round_number', 'hole_number'],
    });

    this.logger.log(`Upserted ${holeRows.length} hole records for round ${round}`);
  }

  async ingestStrokesForPlayer(
    pgaTournamentId: string,
    playerId: string,
    round: number
  ): Promise<void> {
    const shotDetails = await this.pgaTourApi.getShotDetails(pgaTournamentId, playerId, round);
    if (!shotDetails?.holes?.length) {
      return;
    }

    const pgaTournamentPlayerId = `${playerId}-${pgaTournamentId}`;

    const existingHoles = await this.holeRepo.find({
      where: {
        pga_tournament_player_id: pgaTournamentPlayerId,
        round_number: round,
      },
    });

    const holeMap = new Map(existingHoles.map((h) => [`${h.hole_number}`, h.id]));

    const strokeRows: Partial<PgaTournamentPlayerStroke>[] = [];

    for (const hole of shotDetails.holes) {
      const holeId = holeMap.get(`${hole.holeNumber}`);
      if (!holeId) {
        continue;
      }

      for (const stroke of hole.strokes) {
        const coords = stroke.overview?.bottomToTopCoords;

        strokeRows.push({
          pga_tournament_player_hole_id: holeId,
          stroke_number: stroke.strokeNumber,
          from_location: stroke.fromLocation,
          from_location_code: stroke.fromLocationCode,
          to_location: stroke.toLocation,
          to_location_code: stroke.toLocationCode,
          stroke_type: this.mapStrokeType(stroke.strokeType),
          distance: stroke.distance || null,
          distance_remaining: stroke.distanceRemaining || null,
          play_by_play: stroke.playByPlay || null,
          is_final_stroke: stroke.finalStroke,
          ball_speed: stroke.radarData?.ballSpeed ?? null,
          club_speed: stroke.radarData?.clubSpeed ?? null,
          smash_factor: stroke.radarData?.smashFactor ?? null,
          launch_angle: stroke.radarData?.verticalLaunchAngle ?? null,
          launch_spin: stroke.radarData?.launchSpin ?? null,
          spin_axis: stroke.radarData?.spinAxis ?? null,
          apex_height: stroke.radarData?.apexHeight ?? null,
          start_x: coords?.fromCoords?.x ?? null,
          start_y: coords?.fromCoords?.y ?? null,
          end_x: coords?.toCoords?.x ?? null,
          end_y: coords?.toCoords?.y ?? null,
        });
      }
    }

    if (strokeRows.length === 0) {
      return;
    }

    await this.strokeRepo.upsert(strokeRows, {
      conflictPaths: ['pga_tournament_player_hole_id', 'stroke_number'],
    });
  }

  async ingestScoringData(pgaTournament: PgaTournament): Promise<void> {
    const currentRound = pgaTournament.current_round;
    if (!currentRound) {
      this.logger.log(`No current round for tournament ${pgaTournament.id}, skipping ingestion`);
      return;
    }

    for (let round = 1; round <= currentRound; round++) {
      try {
        await this.ingestHolesForRound(pgaTournament.id, round);
      } catch (e) {
        this.logger.error(
          `Failed to ingest holes for round ${round} of ${pgaTournament.id}: ${e}`,
          e instanceof Error ? e.stack : undefined
        );
      }
    }

    const activePlayers = await this.pgaTournamentPlayerService.list({
      tournamentId: pgaTournament.id,
    });
    const players = Array.isArray(activePlayers) ? activePlayers : activePlayers.data;

    const playersToIngest = players.filter(
      (p: PgaTournamentPlayer) => p.score_thru !== null && p.score_thru > 0
    );

    const concurrencyLimit = 5;
    for (let i = 0; i < playersToIngest.length; i += concurrencyLimit) {
      const batch = playersToIngest.slice(i, i + concurrencyLimit);
      await Promise.all(
        batch.map(async (player: PgaTournamentPlayer) => {
          const playerId = String(player.id).split('-')[0];
          for (let round = 1; round <= currentRound; round++) {
            try {
              await this.ingestStrokesForPlayer(pgaTournament.id, playerId, round);
            } catch (e) {
              this.logger.error(
                `Failed to ingest strokes for player ${playerId} round ${round}: ${e}`,
                e instanceof Error ? e.stack : undefined
              );
            }
          }
        })
      );
    }

    this.logger.log(`Scoring data ingestion complete for tournament ${pgaTournament.id}`);
  }

  mapHoleScoreStatus(gqlStatus: GqlHoleScoreStatus | string): HoleScoreStatus {
    const statusMap: Record<string, HoleScoreStatus> = {
      BIRDIE: HoleScoreStatus.Birdie,
      BOGEY: HoleScoreStatus.Bogey,
      EAGLE: HoleScoreStatus.Eagle,
      DOUBLE_BOGEY: HoleScoreStatus.DoubleBogey,
      PAR: HoleScoreStatus.Par,
      NONE: HoleScoreStatus.None,
      CONCEDED: HoleScoreStatus.None,
    };
    return statusMap[gqlStatus] ?? HoleScoreStatus.None;
  }

  private mapStrokeType(gqlType: string): StrokeType {
    const typeMap: Record<string, StrokeType> = {
      STROKE: StrokeType.Stroke,
      PENALTY: StrokeType.Penalty,
      DROP: StrokeType.Drop,
      PROVISIONAL: StrokeType.Provisional,
    };
    return typeMap[gqlType] ?? StrokeType.Stroke;
  }
}
