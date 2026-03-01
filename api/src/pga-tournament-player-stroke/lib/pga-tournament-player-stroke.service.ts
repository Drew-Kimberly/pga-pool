import { Repository } from 'typeorm';

import { PgaTourApiService } from '../../pga-tour-api/lib/v2/pga-tour-api.service';
import { PgaTournamentPlayerHole } from '../../pga-tournament-player-hole/lib/pga-tournament-player-hole.entity';

import { PgaTournamentPlayerStroke } from './pga-tournament-player-stroke.entity';
import { StrokeType } from './pga-tournament-player-stroke.interface';

import { Injectable, Logger, LoggerService, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PgaTournamentPlayerStrokeService {
  constructor(
    @InjectRepository(PgaTournamentPlayerStroke)
    private readonly strokeRepo: Repository<PgaTournamentPlayerStroke>,
    @InjectRepository(PgaTournamentPlayerHole)
    private readonly holeRepo: Repository<PgaTournamentPlayerHole>,
    private readonly pgaTourApi: PgaTourApiService,
    @Optional()
    private readonly logger: LoggerService = new Logger(PgaTournamentPlayerStrokeService.name)
  ) {}

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

    const deduped = new Map<string, Partial<PgaTournamentPlayerStroke>>();
    for (const row of strokeRows) {
      deduped.set(`${row.pga_tournament_player_hole_id}:${row.stroke_number}`, row);
    }

    await this.strokeRepo.upsert([...deduped.values()], {
      conflictPaths: ['pga_tournament_player_hole_id', 'stroke_number'],
    });
  }

  mapStrokeType(gqlType: string): StrokeType {
    const typeMap: Record<string, StrokeType> = {
      STROKE: StrokeType.Stroke,
      PENALTY: StrokeType.Penalty,
      DROP: StrokeType.Drop,
      PROVISIONAL: StrokeType.Provisional,
    };
    return typeMap[gqlType] ?? StrokeType.Stroke;
  }
}
