import { Repository } from 'typeorm';

import {
  defaultListParams,
  IListParams,
  PaginatedCollection,
  TypeOrmListService,
} from '../../common/api/list';

import { User } from './user.entity';
import { CreateUser, UpdateUser } from './user.interface';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly listService: TypeOrmListService<User>
  ) {}

  async list(
    params: IListParams = defaultListParams,
    fieldMap: Record<string, string> = {}
  ): Promise<PaginatedCollection<User>> {
    return this.listService.list(params, {
      entityType: User,
      fieldMap,
      onFindOptions: (opts) => (opts.order = { name: 'ASC' }),
    });
  }

  get(id: string): Promise<User | null> {
    return this.userRepo.findOneBy({ id });
  }

  create(payload: CreateUser): Promise<User> {
    return this.userRepo.save(this.userRepo.create(payload));
  }

  update(payload: UpdateUser): Promise<User> {
    return this.userRepo.save(payload);
  }

  delete(id: string) {
    return this.userRepo.delete(id);
  }
}
