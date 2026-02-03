import { DataSource, EntityManager } from 'typeorm';

import { PgaTournamentStatus } from '../../pga-tournament/lib/pga-tournament.interface';
import { PgaTournamentPlayer } from '../../pga-tournament-player/lib/pga-tournament-player.entity';
import { PgaTournamentPlayerService } from '../../pga-tournament-player/lib/pga-tournament-player.service';
import { PoolScoringFormat } from '../../pool/lib/pool.interface';
import { PoolTournamentUser } from '../../pool-tournament-user/lib/pool-tournament-user.entity';
import { PoolTournamentUserService } from '../../pool-tournament-user/lib/pool-tournament-user.service';
import { PoolUser } from '../../pool-user/lib/pool-user.entity';

import { PoolTournament } from './pool-tournament.entity';
import { PoolTournamentService } from './pool-tournament.service';

import { Injectable, Logger, LoggerService, Optional } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

const SERIALIZATION_FAILURE_CODE = '40001';
const DEFAULT_RETRY_LIMIT = 3;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Injectable()
export class PoolTournamentFinalizerService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly poolTournamentService: PoolTournamentService,
    private readonly pgaTournamentPlayerService: PgaTournamentPlayerService,
    private readonly poolTournamentUserService: PoolTournamentUserService,
    @Optional()
    private readonly logger: LoggerService = new Logger(PoolTournamentFinalizerService.name)
  ) {}

  async finalizePoolTournament(poolTournamentId: string) {
    for (let attempt = 1; attempt <= DEFAULT_RETRY_LIMIT; attempt += 1) {
      try {
        await this.dataSource.transaction('SERIALIZABLE', async (txManager) => {
          await this.lockPoolTournament(txManager, poolTournamentId);
          await this.finalizeWithinTransaction(txManager, poolTournamentId);
        });
        return;
      } catch (error) {
        if (this.isSerializationFailure(error) && attempt < DEFAULT_RETRY_LIMIT) {
          this.logger.warn(
            `Serialization failure finalizing pool tournament ${poolTournamentId}. Retrying (${attempt}/${
              DEFAULT_RETRY_LIMIT - 1
            })...`
          );
          await sleep(100 * attempt);
          continue;
        }
        throw error;
      }
    }
  }

  async finalizeForPgaTournament(pgaTournamentId: string) {
    const poolTournaments = await this.poolTournamentService.listByPgaTournamentId(pgaTournamentId);
    if (poolTournaments.length === 0) {
      this.logger.warn(`No pool tournaments found for PGA Tournament ${pgaTournamentId}`);
      return;
    }

    for (const poolTournament of poolTournaments) {
      await this.finalizePoolTournament(poolTournament.id);
    }
  }

  private async finalizeWithinTransaction(txManager: EntityManager, poolTournamentId: string) {
    const poolTournamentRepo = txManager.getRepository(PoolTournament);
    const poolTournamentUserRepo = txManager.getRepository(PoolTournamentUser);
    const poolUserRepo = txManager.getRepository(PoolUser);

    const poolTournament = await poolTournamentRepo.findOne({
      where: { id: poolTournamentId },
      relations: ['pool', 'pga_tournament'],
    });
    if (!poolTournament) {
      throw new Error(`No Pool Tournament found with ID ${poolTournamentId}`);
    }

    if (poolTournament.scores_are_official) {
      this.logger.log(
        `Scores already official for pool tournament ${poolTournament.id}. Skipping.`
      );
      return;
    }

    await this.pgaTournamentPlayerService.updateScores(
      poolTournament.pga_tournament_id,
      txManager.getRepository(PgaTournamentPlayer)
    );
    this.logger.log(`Updated player scores for PGA Tournament ${poolTournament.pga_tournament_id}`);

    await this.poolTournamentUserService.updateScores(
      poolTournament.id,
      txManager.getRepository(PoolTournamentUser)
    );
    this.logger.log(`Updated pool user scores for pool tournament ${poolTournament.id}`);

    if (poolTournament.pga_tournament.tournament_status !== PgaTournamentStatus.COMPLETED) {
      return;
    }

    const poolTournamentUsers = await poolTournamentUserRepo.find({
      where: { pool_tournament_id: poolTournament.id },
    });

    const updates = poolTournamentUsers.map((poolTournamentUser) => {
      const delta = this.getScoreDelta(poolTournament, poolTournamentUser);
      return poolUserRepo
        .createQueryBuilder()
        .update()
        .set({ pool_score: () => `pool_score + ${delta}` })
        .where('id = :id', { id: poolTournamentUser.pool_user_id })
        .execute();
    });

    await Promise.all(updates);

    poolTournament.scores_are_official = true;
    await poolTournamentRepo.save(poolTournament);

    this.logger.log(`Finalized scores for pool tournament ${poolTournament.id}`);
  }

  private getScoreDelta(poolTournament: PoolTournament, poolTournamentUser: PoolTournamentUser) {
    const scoring = poolTournament.pool.settings?.scoring_format;
    if (scoring === PoolScoringFormat.FedexCuptPoints) {
      return Number(poolTournamentUser.fedex_cup_points ?? 0);
    }
    if (scoring === PoolScoringFormat.Strokes) {
      return Number(poolTournamentUser.tournament_score ?? 0);
    }
    return 0;
  }

  private async lockPoolTournament(txManager: EntityManager, poolTournamentId: string) {
    await txManager.query('SELECT pg_advisory_xact_lock(hashtext($1))', [poolTournamentId]);
  }

  private isSerializationFailure(error: unknown) {
    if (!error || typeof error !== 'object') {
      return false;
    }
    const code = (error as { code?: string }).code;
    return code === SERIALIZATION_FAILURE_CODE;
  }
}
