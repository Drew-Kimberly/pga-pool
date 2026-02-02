import { PgaTournament } from '../lib/pga-tournament.entity';
import {
  PgaTournamentRoundStatus,
  PgaTournamentScoringFormat,
  PgaTournamentStatus,
} from '../lib/pga-tournament.interface';

export class PgaTournamentDto {
  id: string;
  name: string;
  date: TournamentDate;
  purse: number;
  fedex_cup_points: number | null;
  fedex_cup_event: boolean;
  official_fedex_cup_points_calculated: boolean;
  scoring_format: PgaTournamentScoringFormat;
  tournament_status: PgaTournamentStatus;
  round_status: PgaTournamentRoundStatus;
  current_round: number | null;
  course_name: string;
  country: string;
  country_code: string;
  state: string;
  state_code: string;
  city: string;
  logo_url: string | null;
  course_image_url: string | null;
  previous_champion: {
    id: number | null;
    name: string | null;
  };

  static fromEntity(t: PgaTournament): PgaTournamentDto {
    const dto = new PgaTournamentDto();
    dto.id = t.id;
    dto.name = t.name;
    dto.date = TournamentDate.fromEntity(t);
    dto.purse = t.purse;
    dto.fedex_cup_points = t.fedex_cup_points;
    dto.fedex_cup_event = t.fedex_cup_event;
    dto.official_fedex_cup_points_calculated = t.official_fedex_cup_points_calculated;
    dto.scoring_format = t.scoring_format;
    dto.tournament_status = t.tournament_status;
    dto.round_status = t.round_status;
    dto.current_round = t.current_round;
    dto.course_name = t.course_name;
    dto.country = t.country;
    dto.country_code = t.country_code;
    dto.state = t.state;
    dto.state_code = t.state_code;
    dto.city = t.city;
    dto.logo_url = t.logo_url;
    dto.course_image_url = t.course_url;
    dto.previous_champion = { id: t.previous_champion_id, name: t.previous_champion };
    return dto;
  }
}

export class TournamentDate {
  year: number;
  start: string;
  end: string;
  /**
   * @example "America/Los_Angeles"
   */
  timezone: string;
  display: string;
  display_short: string;

  static fromEntity(t: PgaTournament): TournamentDate {
    const dto = new TournamentDate();
    dto.year = t.year;
    dto.start = t.start_date.toISOString();
    dto.end = t.end_date.toISOString();
    dto.timezone = t.timezone;
    dto.display = t.display_date;
    dto.display_short = t.display_date_short;
    return dto;
  }
}
