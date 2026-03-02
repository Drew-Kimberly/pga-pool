import { PoolTournamentFieldAliasPage } from './PoolTournamentFieldAliasPage';

/**
 * Redirects /pga-tournaments/:pgaTournamentId/field to the pool-specific field page.
 * The PGA tournament field route no longer has its own dedicated page since
 * field data is now served from the pool_tournament_player table.
 */
export const TournamentFieldPage = PoolTournamentFieldAliasPage;
