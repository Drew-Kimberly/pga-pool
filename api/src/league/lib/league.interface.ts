import { WithId } from '../../common/types';

import { League } from './league.entity';

export type CreateLeague = Pick<League, 'name'>;
export type UpdateLeague = WithId<CreateLeague>;
