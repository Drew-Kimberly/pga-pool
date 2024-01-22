import { WithId } from '../../common/types';

import { LeagueUser } from './league-user.entity';

export type CreateLeagueUser = Pick<LeagueUser, 'league_id' | 'user_id' | 'is_owner'>;
export type UpdateLeagueUser = WithId<CreateLeagueUser>;
