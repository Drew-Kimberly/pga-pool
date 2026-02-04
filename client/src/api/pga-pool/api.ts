import { AxiosError } from 'axios';

import authClient from '../auth-client';

import {
  Configuration,
  PGATournamentFieldApi,
  PoolsApi,
  PoolTournamentsApi,
  PoolTournamentUsersApi,
} from '@drewkimberly/pga-pool-api';

const poolTournamentApi = new PoolTournamentsApi(new Configuration(), '', authClient);
const poolTournamentUsersApi = new PoolTournamentUsersApi(new Configuration(), '', authClient);
const pgaTournamentFieldApi = new PGATournamentFieldApi(new Configuration(), '', authClient);
const poolsApi = new PoolsApi(new Configuration(), '', authClient);

export const pgaPoolApi = {
  pools: poolsApi,
  poolTournaments: poolTournamentApi,
  poolTournamentUsers: poolTournamentUsersApi,
  pgaTournamentField: pgaTournamentFieldApi,
  is404Error: (e: Error) => e instanceof AxiosError && e.response?.status === 404,
};
