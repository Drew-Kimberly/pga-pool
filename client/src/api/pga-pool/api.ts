import axios, { AxiosError } from 'axios';

import { Configuration, PGATournamentsApi, PoolTournamentApi } from '@drewkimberly/pga-pool-api';

const client = axios.create({
  baseURL: process.env.REACT_APP_PGA_POOL_API_URL,
});

const poolTournamentApi = new PoolTournamentApi(new Configuration(), '', client);
const pgaTournamentApi = new PGATournamentsApi(new Configuration(), '', client);

export const pgaPoolApi = {
  poolTournaments: poolTournamentApi,
  pgaTournaments: pgaTournamentApi,
  is404Error: (e: Error) => e instanceof AxiosError && e.response?.status === 404,
};
