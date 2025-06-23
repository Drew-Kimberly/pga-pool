import { WithId } from '../../common/types';

import { User } from './user.entity';

export type CreateUser = Pick<User, 'name' | 'nickname' | 'email' | 'is_admin' | 'auth0_id' | 'picture_url' | 'last_login' | 'auth_provider'>;
export type UpdateUser = WithId<Partial<CreateUser>>;
