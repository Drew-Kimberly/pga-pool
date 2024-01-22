import { ListModule } from '../../common/api/list';

import { User } from './user.entity';
import { UserService } from './user.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ListModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
