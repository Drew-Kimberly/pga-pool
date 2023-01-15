import axios from 'axios';

import { Configuration, PoolTournamentApi } from '@drewkimberly/pga-pool-api';

console.log(process.env);

const client = axios.create({
  // baseURL: 'https://api.pga-pool.drewk.dev',
  baseURL: process.env.REACT_APP_PGA_POOL_API_URL,
});

const poolTournamentApi = new PoolTournamentApi(new Configuration(), '', client);

export const pgaPoolApi = {
  poolTournaments: poolTournamentApi,
};
