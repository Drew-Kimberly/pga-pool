export interface PgaTournamentField {
  pga_tournament_id: string;
  /**
   * @note epoch timestamp
   */
  created_at: number;

  player_tiers: {
    [tier: string]: {
      [pga_player_id: string]: { name: string; odds: string };
    };
  };
}
