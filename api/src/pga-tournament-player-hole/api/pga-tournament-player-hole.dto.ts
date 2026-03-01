import { PgaTournamentPlayerHole } from '../lib/pga-tournament-player-hole.entity';
import { HoleScoreStatus } from '../lib/pga-tournament-player-hole.interface';

export class RoundSummaryDto {
  round_number: number;
  strokes: number;
  to_par: number;

  static from(data: { round_number: number; strokes: number; to_par: number }): RoundSummaryDto {
    const dto = new RoundSummaryDto();
    dto.round_number = data.round_number;
    dto.strokes = data.strokes;
    dto.to_par = data.to_par;
    return dto;
  }
}

export class ScorecardHoleDto {
  hole_number: number;
  par: number;
  score: number;
  to_par: number;
  status: HoleScoreStatus;
  yardage: number;

  static fromEntity(hole: PgaTournamentPlayerHole): ScorecardHoleDto {
    const dto = new ScorecardHoleDto();
    dto.hole_number = hole.hole_number;
    dto.par = hole.par;
    dto.score = hole.score;
    dto.to_par = hole.to_par;
    dto.status = hole.status;
    dto.yardage = hole.yardage;
    return dto;
  }
}

export class ScorecardDto {
  round_number: number;
  strokes: number;
  to_par: number;
  holes: ScorecardHoleDto[];

  static from(round: number, holes: PgaTournamentPlayerHole[]): ScorecardDto {
    const dto = new ScorecardDto();
    dto.round_number = round;
    dto.holes = holes.map(ScorecardHoleDto.fromEntity);
    dto.strokes = holes.reduce((sum, h) => sum + h.score, 0);
    dto.to_par = holes.reduce((sum, h) => sum + h.to_par, 0);
    return dto;
  }
}
