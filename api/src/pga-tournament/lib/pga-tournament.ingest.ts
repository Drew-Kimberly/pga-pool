/* eslint-disable prettier/prettier */
import { strToNum } from '../../common/util';
import { ScheduleQuery } from '../../pga-tour-api/lib/v2/generated/graphql';
import { PgaTourApiService } from '../../pga-tour-api/lib/v2/pga-tour-api.service';

import { PGA_TOURNAMENT_LENGTH_DAYS } from './pga-tournament.constants';
import { PgaTournament } from './pga-tournament.entity';
import { PgaTournamentFeatures, PgaTournamentRoundStatus, PgaTournamentScoringFormat, PgaTournamentStatus, SavePgaTournament } from './pga-tournament.interface';
import { PgaTournamentService } from './pga-tournament.service';

import { Injectable, Logger, LoggerService, Optional } from '@nestjs/common';

type ScheduleTournament = ScheduleQuery['schedule']['completed'][number]['tournaments'][number];

@Injectable()
export class PgaTournamentIngestor {
  constructor(
    private readonly pgaTournamentService: PgaTournamentService,
    private readonly pgaTourApi: PgaTourApiService,
    @Optional()
    private readonly logger: LoggerService = new Logger(PgaTournamentIngestor.name)
  ) {}

  async ingest(opts?: { yearOverride?: number; tourneyIdOverride?: string }) {
    const { yearOverride, tourneyIdOverride } = opts ?? {}

    // Use 40 day forward-facing window to accommodate when a PGA Tour season starts in Dec.
    const year = yearOverride ?? new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).getFullYear();
    const tournamentsResponse = await this.pgaTourApi.getTournamentSchedule(year);

    const scheduleTourneys: ScheduleTournament[] = []
    const tourneysToIngest: Record<string, SavePgaTournament> = {};
    const tourneyIds: string[] = [];

    for (const tourneys of [...tournamentsResponse.completed, ...tournamentsResponse.upcoming]) {
      for (const t of tourneys.tournaments) {
        if (!tourneyIdOverride || tourneyIdOverride === t.id) {
          scheduleTourneys.push(t)
          tourneyIds.push(t.id);
          tourneysToIngest[t.id] = {
            id: t.id,
            name: t.tournamentName,
            tournament_id: t.id.substring(5),
            year,
            month: tourneys.month,
            start_date: new Date(t.startDate as number),
            // Set the end_date to 1 min before midnight on the 4th day (i.e. Sunday at 11:59pm)
            end_date: new Date((t.startDate as number) + (PGA_TOURNAMENT_LENGTH_DAYS * 24 * 60 * 60 * 1000) - (60 * 1000)),
            display_date: t.dateAccessibilityText,
            display_date_short: t.date,
            purse: strToNum((t.purse ?? '').substring(1).split(',').join('')) ?? 0,
            fedex_cup_event: t.tourStandingHeading === 'FEDEXCUP',
            fedex_cup_points: t.tourStandingValue ? strToNum(t.tourStandingValue.split(' ')[0]) : null,
            course_name: t.courseName,
            country: t.country,
            country_code: t.countryCode,
            state: t.state,
            state_code: t.stateCode,
            city: t.city,
            previous_champion: t.champion ?? null,
            previous_champion_id: Number(t.championId) ?? null,
            logo_url: t.tournamentLogo,
            course_url: t.beautyImage ?? '',
          } as PgaTournament;
        }
      }
    }

    const tourneys = await this.pgaTourApi.getTournaments(tourneyIds);

    for (const t of tourneys) {
      tourneysToIngest[t.id] = {
        ...tourneysToIngest[t.id],
        timezone: t.timezone,
        scoring_format: t.formatType as PgaTournamentScoringFormat,
        tournament_status: t.tournamentStatus as PgaTournamentStatus,
        round_status: t.roundStatus as PgaTournamentRoundStatus,
        current_round: t.currentRound > 0 ? t.currentRound : null,
        features: (t.features ?? []) as PgaTournamentFeatures[],
      }
    }

    const payload = Object.values(tourneysToIngest)
    this.logger.log(`Ingesting ${payload.length} PGA Tour tournaments`);
    return this.pgaTournamentService.save(Object.values(payload));
  }
}
