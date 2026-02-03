import { Pool } from '../../../../pool/lib/pool.entity';
import { PoolScoringFormat, PoolType } from '../../../../pool/lib/pool.interface';
import { PoolTournament } from '../../../../pool-tournament/lib/pool-tournament.entity';
import { PoolUser } from '../../../../pool-user/lib/pool-user.entity';
import { leagueSeed } from '../../league.seed';

export type PoolSeed = Pick<Pool, 'id' | 'year' | 'name' | 'type' | 'settings' | 'league_id'>;
export type PoolTournamentSeed = Pick<
  PoolTournament,
  'id' | 'pool_id' | 'league_id' | 'pga_tournament_id'
>;
export type PoolUserSeed = Pick<PoolUser, 'id' | 'pool_id' | 'league_id' | 'user_id'>;

export const poolSeed: PoolSeed = {
  id: 'a78f9958-43ea-423c-b005-7a8dbcda31cf',
  name: '2026',
  year: 2026,
  type: PoolType.Season,
  settings: {
    scoring_format: PoolScoringFormat.FedexCuptPoints,
    include_LIV: false,
  },
  league_id: leagueSeed.id,
};

const pgaTournamentIds = [
  'R2026004', // Farmers Insurance Open
  'R2026003', // WM Phoenix Open
  'R2026005', // AT&T Pebble Beach Pro-Am
  'R2026007', // The Genesis Invitational
  'R2026010', // Cognizant Classic in The Palm Beaches
  'R2026009', // Arnold Palmer Invitational presented by Mastercard
  'R2026011', // THE PLAYERS Championship
  'R2026475', // Valspar Championship
  'R2026020', // Texas Children's Houston Open
  'R2026041', // Valero Texas Open
  'R2026014', // Masters Tournament
  'R2026012', // RBC Heritage
  'R2026556', // Cadillac Championship
  'R2026480', // Truist Championship
  'R2026033', // PGA Championship
  'R2026019', // THE CJ CUP Byron Nelson
  'R2026021', // Charles Schwab Challenge
  'R2026023', // the Memorial Tournament presented by Workday
  'R2026032', // RBC Canadian Open
  'R2026026', // U.S. Open
  'R2026034', // Travelers Championship
  'R2026030', // John Deere Classic
  'R2026541', // Genesis Scottish Open
  'R2026100', // The Open Championship
  'R2026525', // 3M Open
  'R2026524', // Rocket Classic
  'R2026013', // Wyndham Championship
  'R2026027', // FedEx St. Jude Championship
  'R2026028', // BMW Championship
];

const poolTournamentIds = [
  'f9d36041-6ef2-4016-9d01-29bfb390ccca',
  '4e3692fb-5bfb-43dc-aa8b-22e94ad92b57',
  '4c67192d-e4e7-46d0-80f0-fffb215ff3e3',
  '0645044a-6452-45d5-97e8-62860c36af9d',
  'f73b7a1b-781e-459a-9b8c-fb42c273265d',
  '578e7da8-340f-4fc7-8b20-fea1cb23d546',
  '2eaebcee-c684-458a-86a6-7737a9c64854',
  '9accfa93-4f7f-4917-a8b8-6b5be1a061b4',
  '51897322-750e-4050-8565-bea4371f7d85',
  '0283b87b-562b-481c-902c-5ed0c9703c0a',
  'f094325f-5a9f-4a67-a51e-8727d48fc579',
  'db269f71-92a1-4945-972c-159d8ed6e2c5',
  '738d39c7-f83b-443a-9857-27c0922baba8',
  '03a0a7d4-2bef-4b1c-ae45-740953074a23',
  '98666499-4087-48f9-9b70-3bab5e67dddb',
  'd91598f0-c6d8-4258-b4ca-b7acf51e59ae',
  '2775495a-1e45-44c4-9cc8-9dc70044f4b6',
  '2cb2d0db-ad97-4d9d-b9f0-f0aef2cba992',
  '9e431334-d583-4414-891b-b625b25424a0',
  '01254c06-015f-4f85-ab57-bb9dcf83a436',
  '5c4f0263-532a-4efd-9b3d-47015fceb73a',
  'aa3d5efa-fa37-4e6e-84d5-248805fcc48a',
  '0535cbcf-124e-4b5b-8967-e66ed70d95eb',
  '9117aa54-7281-4386-b290-b2955aa84ae1',
  'd3eb508c-85b9-4640-bca4-ae1d29fea784',
  '01f51e24-e5d8-4559-bfab-d4ec76d1e00a',
  '5f1c33b9-9e92-4f6f-b6c1-5328c27f2422',
  '86569a68-10a0-4a92-87f3-1fdee064ce68',
  '351d0ebb-db39-4bd0-b90a-0573415c9f71',
];

export const poolTournamentSeeds: PoolTournamentSeed[] = pgaTournamentIds.map(
  (pgaTournamentId, index) => ({
    id: poolTournamentIds[index],
    pool_id: poolSeed.id,
    league_id: leagueSeed.id,
    pga_tournament_id: pgaTournamentId,
  })
);

const poolUserSeedsById: Array<Pick<PoolUserSeed, 'id' | 'user_id'>> = [
  { id: '18fb49d7-8180-4efc-9c3a-dbaa8b0124f2', user_id: '06769cd2-0527-4542-a383-501563f2c461' }, // Drew Kimberly
  { id: 'b88e7260-7df5-45fa-a1bc-79e827409948', user_id: '988284de-b4cc-4102-b638-f1caf19baf03' }, // John Berardino
  { id: 'c003ca17-a9e7-447a-b418-ebe1346c4dda', user_id: 'ac24bce6-aa47-41df-83c1-7a9e117d1868' }, // Tommy Winschel
  { id: 'add4a7bc-f98e-411c-b15e-7fb9a35fd6a0', user_id: '969814fc-a862-446c-91a6-c442c0d798c3' }, // Austin Henry
  { id: '8f570828-d4cb-4dfb-8b25-63ce190a4044', user_id: 'ba4bf7aa-26d7-42d1-adf6-60a9a635cb66' }, // Brendan Ferguson
  { id: '897537ab-2d8d-433e-a108-9c0e4858128a', user_id: '6bf50749-9321-44c6-92d7-190707f9f30e' }, // Dave Fentner
  { id: 'eea7d358-74b8-46c1-9ba6-cae865a8a2f2', user_id: '539ae3e4-3d43-4368-8af8-373032a08195' }, // Mickey Gorman
  { id: '46893eac-5dd8-4642-a10f-a9b4141b9bf8', user_id: 'cabd7e45-0e55-448b-86a7-5bae64e9d823' }, // Jeremy Burger
  { id: '1ff5dee0-8a67-4fe3-8c45-f816f25236a3', user_id: '3c8eb1ba-da31-4510-9604-092859db3af5' }, // Nick Krueger
  { id: '925ee6ee-37bf-44f4-a4b2-2ebe31de45ae', user_id: 'eb2901e9-b660-4455-aa5b-330f28b503d9' }, // Tim Santos
  { id: '144e42aa-2d6e-428b-bc0c-f53525ff1ce0', user_id: '9521eb4e-5054-40a4-9374-4b8ef8c95708' }, // Sam McClain
  { id: '10e40672-b7a5-421c-ad9b-be6daea9cbab', user_id: '3d592297-4761-482e-98c9-63d16775dde3' }, // Brendan M
  { id: 'a8644194-fbb4-4515-b7e5-19ec6aa9783b', user_id: 'cde56af9-5243-41c0-a939-2bc48273e9f9' }, // Ben Simmons
  { id: 'c4c1262c-b483-44f3-987a-52defb3a8a95', user_id: '7d5b0733-c1d1-4063-8c59-b84029e66d95' }, // Dave Fishman
  { id: 'c1e61fbb-709b-4fdb-934b-753803f9cd9e', user_id: 'fb1f356e-6789-4439-b55b-6a8295a2ca68' }, // Zach
];

export const poolUserSeeds: PoolUserSeed[] = poolUserSeedsById.map((seed) => ({
  ...seed,
  pool_id: poolSeed.id,
  league_id: leagueSeed.id,
}));
