import { WithId } from '../../common/types';

import { User } from './user.entity';

export type CreateUser = Pick<User, 'name' | 'nickname' | 'email' | 'is_admin'>;
export type UpdateUser = WithId<Partial<CreateUser>>;
