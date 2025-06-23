import { AxiosError } from 'axios';

import authClient from '../auth-client';

import { Configuration, PGATournamentsApi, PoolTournamentApi } from '@drewkimberly/pga-pool-api';

const poolTournamentApi = new PoolTournamentApi(new Configuration(), '', authClient);
const pgaTournamentApi = new PGATournamentsApi(new Configuration(), '', authClient);

export const pgaPoolApi = {
  poolTournaments: poolTournamentApi,
  pgaTournaments: pgaTournamentApi,
  is404Error: (e: Error) => e instanceof AxiosError && e.response?.status === 404,
};
