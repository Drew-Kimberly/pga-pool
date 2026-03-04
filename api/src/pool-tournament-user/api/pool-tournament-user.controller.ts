import { ControllerBase } from '../../common/api';
import { IListParams, List, ListParams, PaginatedCollection } from '../../common/api/list';
import { UUIDValidationPipe } from '../../common/api/validation';
import { RoundSummaryDto } from '../../pga-tournament-player-hole/api/pga-tournament-player-hole.dto';
import { PgaTournamentPlayerHoleService } from '../../pga-tournament-player-hole/lib/pga-tournament-player-hole.service';
import { PoolScoringFormat } from '../../pool/lib/pool.interface';
import { PoolTournamentService } from '../../pool-tournament/lib/pool-tournament.service';
import { PoolTournamentUser } from '../lib/pool-tournament-user.entity';
import { PoolTournamentUserService } from '../lib/pool-tournament-user.service';

import { PoolTournamentUserDto } from './pool-tournament-user.dto';

import { Controller, NotFoundException } from '@nestjs/common';

@Controller('pools/:poolId/tournaments/:poolTournamentId/users')
export class PoolTournamentUserController extends ControllerBase {
  constructor(
    private readonly poolTournamentService: PoolTournamentService,
    private readonly poolTournamentUserService: PoolTournamentUserService,
    private readonly holeService: PgaTournamentPlayerHoleService
  ) {
    super();
  }

  @List()
  async listPoolTournamentUsers(
    @UUIDValidationPipe('poolId') poolId: string,
    @UUIDValidationPipe('poolTournamentId') poolTournamentId: string,
    @ListParams() params: IListParams
  ): Promise<PaginatedCollection<PoolTournamentUserDto>> {
    const poolTournament = await this.poolTournamentService.get(poolTournamentId, poolId);
    if (!poolTournament) {
      throw new NotFoundException(`Pool Tournament (ID: ${poolTournamentId}) not found`);
    }

    const scoring = poolTournament.pool.settings?.scoring_format;
    const scoreOrder = scoring === PoolScoringFormat.Strokes ? 'ASC' : 'DESC';
    const scoreField =
      scoring === PoolScoringFormat.FedexCuptPoints ? 'fedex_cup_points' : 'tournament_score';

    const result = await this.poolTournamentUserService.listPaginated(
      poolTournamentId,
      params,
      scoreOrder,
      scoreField
    );

    const playerIds = extractPlayerIds(result.data);
    const rawRoundsMap = await this.holeService.getRoundSummariesBatch(playerIds);
    const roundsMap = toRoundSummaryDtoMap(rawRoundsMap);

    return { ...result, data: toRankedDtos(result.data, scoreField, roundsMap) };
  }
}

function extractPlayerIds(users: PoolTournamentUser[]): string[] {
  const ids = new Set<string>();
  for (const user of users) {
    for (const pick of user.picks) {
      ids.add(pick.pool_tournament_player.pga_tournament_player.id);
    }
  }
  return [...ids];
}

function toRoundSummaryDtoMap(
  raw: Map<string, { round_number: number; strokes: number; to_par: number }[]>
): Map<string, RoundSummaryDto[]> {
  const map = new Map<string, RoundSummaryDto[]>();
  for (const [id, rounds] of raw) {
    map.set(id, rounds.map(RoundSummaryDto.from));
  }
  return map;
}

function toRankedDtos(
  users: PoolTournamentUser[],
  scoreField: 'tournament_score' | 'fedex_cup_points',
  roundsMap?: Map<string, RoundSummaryDto[]>
): PoolTournamentUserDto[] {
  let previousScore: number | null = null;
  let rank = 0;
  const numericRanks: number[] = [];

  for (let i = 0; i < users.length; i++) {
    const score = users[i][scoreField];
    if (previousScore === null || score !== previousScore) {
      rank = i + 1;
      previousScore = score;
    }
    numericRanks.push(rank);
  }

  const ranks = numericRanks.map((r, i) => {
    const isTied =
      (i > 0 && numericRanks[i - 1] === r) ||
      (i < numericRanks.length - 1 && numericRanks[i + 1] === r);
    return isTied ? `T${r}` : `${r}`;
  });

  return users.map((user, idx) => PoolTournamentUserDto.fromEntity(user, ranks[idx], roundsMap));
}
