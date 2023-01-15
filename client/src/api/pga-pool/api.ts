import axios from 'axios';

import { Configuration, PoolTournamentApi } from '@drewkimberly/pga-pool-api';

const client = axios.create({
  baseURL: process.env.REACT_APP_PGA_POOL_API_URL,
});

const poolTournamentApi = new PoolTournamentApi(new Configuration(), '', client);

export const pgaPoolApi = {
  poolTournaments: poolTournamentApi,
};
