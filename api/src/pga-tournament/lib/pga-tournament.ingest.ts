/* eslint-disable prettier/prettier */
import { strToNum } from '../../common/util';
import { DomainEventBus } from '../../domain-events/domain-event-bus';
import { ScheduleQuery } from '../../pga-tour-api/lib/v2/generated/graphql';
import { PgaTourApiService } from '../../pga-tour-api/lib/v2/pga-tour-api.service';

import { PGA_TOURNAMENT_LENGTH_DAYS } from './pga-tournament.constants';
import { PgaTournament } from './pga-tournament.entity';
import { PgaTournamentEventMap } from './pga-tournament.events';
import { PgaTournamentFeatures, PgaTournamentRoundStatus, PgaTournamentScoringFormat, PgaTournamentStatus, SavePgaTournament } from './pga-tournament.interface';
import { PgaTournamentService } from './pga-tournament.service';

import { Injectable, Logger, LoggerService, Optional } from '@nestjs/common';

type ScheduleTournament = ScheduleQuery['schedule']['completed'][number]['tournaments'][number];

@Injectable()
export class PgaTournamentIngestor {
  constructor(
    private readonly pgaTournamentService: PgaTournamentService,
    private readonly pgaTourApi: PgaTourApiService,
    private readonly eventBus: DomainEventBus,
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
            previous_champion_id: t.championId ? Number(t.championId) : null,
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

    for (const tourneyId of Object.keys(tourneysToIngest)) {
      try {
        const stats = await this.pgaTourApi.getCourseStats(tourneyId);
        if (stats?.courses?.length) {
          const course = stats.courses.find((c) => c.hostCourse) ?? stats.courses[0];
          tourneysToIngest[tourneyId].par = course.par;
          tourneysToIngest[tourneyId].yardage = strToNum(course.yardage.split(',').join('')) ?? null;
        }
      } catch (e) {
        this.logger.warn(`Could not fetch course stats for ${tourneyId}: ${e}`);
      }
    }

    const payload = Object.values(tourneysToIngest)
    this.logger.log(`Ingesting ${payload.length} PGA Tour tournaments`);

    // Snapshot existing statuses to detect status transitions
    const existingTournaments = await this.pgaTournamentService.listByIds(
      payload.map((t) => t.id)
    );
    const previousStatusMap = new Map(
      existingTournaments.map((t) => [t.id, t.tournament_status])
    );

    const saved = await this.pgaTournamentService.save(payload);

    // Build a lookup of saved entities for event payloads
    const savedById = new Map(saved.map((t) => [t.id, t]));

    // Emit status-updated events for tournaments that changed status
    for (const t of payload) {
      const previousStatus = previousStatusMap.get(t.id);
      const newStatus = t.tournament_status;
      if (newStatus && previousStatus !== newStatus) {
        const savedEntity = savedById.get(t.id);
        if (savedEntity) {
          this.eventBus.emit<PgaTournamentEventMap>('pga-tournament.status-updated', {
            pgaTournament: savedEntity,
            previousStatus: previousStatus ?? PgaTournamentStatus.NOT_STARTED,
            newStatus,
          });
          this.logger.log(
            `Tournament ${t.id} status changed ${previousStatus ?? 'NEW'} → ${newStatus} — emitted domain event`
          );
        }
      }
    }

    return saved;
  }
}
