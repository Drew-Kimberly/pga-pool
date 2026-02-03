import { League } from '../../league/lib/league.entity';
import { LeagueUser } from '../../league-user/lib/league-user.entity';
import { User } from '../../user/lib/user.entity';

export type LeagueSeed = Pick<League, 'id' | 'name'>;
export type UserSeed = Pick<User, 'id' | 'name' | 'nickname' | 'is_admin'>;
export type LeagueUserSeed = Pick<LeagueUser, 'id' | 'league_id' | 'user_id' | 'is_owner'>;

export const leagueSeed: LeagueSeed = {
  id: '7f232cbd-988f-4c5b-b76d-b2380f541f70',
  name: 'Annual PGA Pool',
};

export const userSeeds: UserSeed[] = [
  {
    id: '06769cd2-0527-4542-a383-501563f2c461',
    name: 'Drew Kimberly',
    nickname: 'Jumbo',
    is_admin: true,
  },
  {
    id: '988284de-b4cc-4102-b638-f1caf19baf03',
    name: 'John Berardino',
    nickname: 'JBer',
    is_admin: false,
  },
  {
    id: 'ac24bce6-aa47-41df-83c1-7a9e117d1868',
    name: 'Tommy Winschel',
    nickname: 'Tomcat',
    is_admin: false,
  },
  {
    id: 'fc19e67f-bdc8-4a8e-b9a0-4ac7cd255f5c',
    name: 'Andrew DeCarlo',
    nickname: 'Andy DeCarlo',
    is_admin: false,
  },
  {
    id: '969814fc-a862-446c-91a6-c442c0d798c3',
    name: 'Austin Henry',
    nickname: 'Austin Henry',
    is_admin: false,
  },
  {
    id: 'cde56af9-5243-41c0-a939-2bc48273e9f9',
    name: 'Ben Simmons',
    nickname: 'Big Ben',
    is_admin: false,
  },
  {
    id: 'ba4bf7aa-26d7-42d1-adf6-60a9a635cb66',
    name: 'Brendan Ferguson',
    nickname: 'Ferg',
    is_admin: false,
  },
  {
    id: 'b2bac842-d57d-44b9-afa1-9ece63066f93',
    name: 'Connor Gallagher',
    nickname: 'Moose',
    is_admin: false,
  },
  {
    id: '6bf50749-9321-44c6-92d7-190707f9f30e',
    name: 'Dave Fentner',
    nickname: 'Raleigh Dave',
    is_admin: false,
  },
  {
    id: 'c4487d32-8e25-4c99-b482-04323e071d44',
    name: 'Harry Whiteley',
    nickname: 'Harold',
    is_admin: false,
  },
  {
    id: 'cabd7e45-0e55-448b-86a7-5bae64e9d823',
    name: 'Jeremy Burger',
    nickname: 'Jeremy Burger',
    is_admin: false,
  },
  {
    id: '3c8eb1ba-da31-4510-9604-092859db3af5',
    name: 'Nick Krueger',
    nickname: 'Nick Krueger',
    is_admin: false,
  },
  {
    id: 'd133a850-049f-4469-9ab4-1cfda45a9ddb',
    name: 'Pierce Fowler',
    nickname: 'Big P',
    is_admin: false,
  },
  {
    id: '99b7cb39-461a-41e0-b785-999a619835cc',
    name: 'Thomas Fowler',
    nickname: 'Thomas Fowler',
    is_admin: false,
  },
  {
    id: 'eb2901e9-b660-4455-aa5b-330f28b503d9',
    name: 'Tim Santos',
    nickname: 'Tim Santos',
    is_admin: false,
  },
  {
    id: '539ae3e4-3d43-4368-8af8-373032a08195',
    name: 'Mickey Gorman',
    nickname: 'Uncle Norm',
    is_admin: false,
  },
  {
    id: '9521eb4e-5054-40a4-9374-4b8ef8c95708',
    name: 'Sam McClain',
    nickname: 'Sam McClain',
    is_admin: false,
  },
  {
    id: 'ac28226b-d87b-4f6e-83ab-46e72b11b926',
    name: 'Ashwin Prakash',
    nickname: 'Shwin',
    is_admin: false,
  },
  {
    id: '3d592297-4761-482e-98c9-63d16775dde3',
    name: 'Brendan M',
    nickname: 'Brendan M',
    is_admin: false,
  },
  {
    id: '7d5b0733-c1d1-4063-8c59-b84029e66d95',
    name: 'Dave Fishman',
    nickname: 'Frat Dave',
    is_admin: false,
  },
  {
    id: 'af5d1fb6-c44f-4158-89c9-457f1065e52d',
    name: 'Chris Denison',
    nickname: 'Big Bear',
    is_admin: false,
  },
  {
    id: 'fb1f356e-6789-4439-b55b-6a8295a2ca68',
    name: 'Zach',
    nickname: 'Zach',
    is_admin: false,
  },
];

export const leagueUserSeeds: LeagueUserSeed[] = [
  {
    id: 'a8f3ea8d-eada-4e0a-b709-be5b4766853e',
    league_id: '7f232cbd-988f-4c5b-b76d-b2380f541f70',
    user_id: '06769cd2-0527-4542-a383-501563f2c461',
    is_owner: true,
  },
  {
    id: 'a872ea79-76ce-4018-9ee6-1e6526ab3241',
    league_id: '7f232cbd-988f-4c5b-b76d-b2380f541f70',
    user_id: '988284de-b4cc-4102-b638-f1caf19baf03',
    is_owner: true,
  },
  {
    id: '17ea2ce7-ce9c-4a79-9630-22b9bc1456e2',
    league_id: '7f232cbd-988f-4c5b-b76d-b2380f541f70',
    user_id: 'ac24bce6-aa47-41df-83c1-7a9e117d1868',
    is_owner: false,
  },
  {
    id: 'd0baee18-4914-4a73-ab91-9504672513e4',
    league_id: '7f232cbd-988f-4c5b-b76d-b2380f541f70',
    user_id: 'fc19e67f-bdc8-4a8e-b9a0-4ac7cd255f5c',
    is_owner: false,
  },
  {
    id: '8d617b48-8e44-470b-83cb-89b81a20ca5a',
    league_id: '7f232cbd-988f-4c5b-b76d-b2380f541f70',
    user_id: '969814fc-a862-446c-91a6-c442c0d798c3',
    is_owner: false,
  },
  {
    id: 'e6b125b8-e174-4c9a-85b0-918a086df03b',
    league_id: '7f232cbd-988f-4c5b-b76d-b2380f541f70',
    user_id: 'cde56af9-5243-41c0-a939-2bc48273e9f9',
    is_owner: false,
  },
  {
    id: '8351734c-8ede-47c2-a36a-6e503d32fe7f',
    league_id: '7f232cbd-988f-4c5b-b76d-b2380f541f70',
    user_id: 'ba4bf7aa-26d7-42d1-adf6-60a9a635cb66',
    is_owner: false,
  },
  {
    id: '7dadf90a-d792-453b-84e7-322d70edd16b',
    league_id: '7f232cbd-988f-4c5b-b76d-b2380f541f70',
    user_id: 'b2bac842-d57d-44b9-afa1-9ece63066f93',
    is_owner: false,
  },
  {
    id: 'a6f011bc-f7bb-4abc-b954-75e158556f49',
    league_id: '7f232cbd-988f-4c5b-b76d-b2380f541f70',
    user_id: '6bf50749-9321-44c6-92d7-190707f9f30e',
    is_owner: false,
  },
  {
    id: '39eddcac-b1b5-40b2-92e4-95eb11219fcc',
    league_id: '7f232cbd-988f-4c5b-b76d-b2380f541f70',
    user_id: 'c4487d32-8e25-4c99-b482-04323e071d44',
    is_owner: false,
  },
  {
    id: 'ce67d456-27d2-4308-a4a3-43cb0b432543',
    league_id: '7f232cbd-988f-4c5b-b76d-b2380f541f70',
    user_id: 'cabd7e45-0e55-448b-86a7-5bae64e9d823',
    is_owner: false,
  },
  {
    id: 'e2038747-df50-497c-9869-1fad207278df',
    league_id: '7f232cbd-988f-4c5b-b76d-b2380f541f70',
    user_id: '3c8eb1ba-da31-4510-9604-092859db3af5',
    is_owner: false,
  },
  {
    id: '94fd5986-87e5-4f2e-9e1f-a8da861d52d2',
    league_id: '7f232cbd-988f-4c5b-b76d-b2380f541f70',
    user_id: 'd133a850-049f-4469-9ab4-1cfda45a9ddb',
    is_owner: false,
  },
  {
    id: '5636040f-45f0-4890-b620-f09fbf8af889',
    league_id: '7f232cbd-988f-4c5b-b76d-b2380f541f70',
    user_id: '99b7cb39-461a-41e0-b785-999a619835cc',
    is_owner: false,
  },
  {
    id: '0c0ba367-9ec3-467a-929f-0f8d06f71e2e',
    league_id: '7f232cbd-988f-4c5b-b76d-b2380f541f70',
    user_id: 'eb2901e9-b660-4455-aa5b-330f28b503d9',
    is_owner: false,
  },
  {
    id: '5381d92b-7aae-4af1-9b23-f731c279fc7c',
    league_id: '7f232cbd-988f-4c5b-b76d-b2380f541f70',
    user_id: '539ae3e4-3d43-4368-8af8-373032a08195',
    is_owner: false,
  },
  {
    id: '99a77af1-55fc-4183-b3ce-c8cdd2960baf',
    league_id: '7f232cbd-988f-4c5b-b76d-b2380f541f70',
    user_id: '9521eb4e-5054-40a4-9374-4b8ef8c95708',
    is_owner: false,
  },
  {
    id: '8465c92c-0b7f-4576-9112-a491bcbbc92b',
    league_id: '7f232cbd-988f-4c5b-b76d-b2380f541f70',
    user_id: 'ac28226b-d87b-4f6e-83ab-46e72b11b926',
    is_owner: false,
  },
  {
    id: '661aecf7-176f-4271-9cde-11390387b0d3',
    league_id: '7f232cbd-988f-4c5b-b76d-b2380f541f70',
    user_id: '3d592297-4761-482e-98c9-63d16775dde3',
    is_owner: false,
  },
  {
    id: 'fbde0580-9403-4b94-a108-6a3e76d7f355',
    league_id: '7f232cbd-988f-4c5b-b76d-b2380f541f70',
    user_id: '7d5b0733-c1d1-4063-8c59-b84029e66d95',
    is_owner: false,
  },
  {
    id: '2ece8da6-3697-460a-b42c-b39f173a6758',
    league_id: '7f232cbd-988f-4c5b-b76d-b2380f541f70',
    user_id: 'af5d1fb6-c44f-4158-89c9-457f1065e52d',
    is_owner: false,
  },
  {
    id: '573796b0-8337-4bfb-b4fe-c57514b6f549',
    league_id: '7f232cbd-988f-4c5b-b76d-b2380f541f70',
    user_id: 'fb1f356e-6789-4439-b55b-6a8295a2ca68',
    is_owner: false,
  },
];
