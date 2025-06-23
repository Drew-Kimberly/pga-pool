import { UserService } from '../../../src/user/lib/user.service';
import { PgaPoolCliModule } from '../../cli.module';
import { outputJson } from '../../utils';

import { NestFactory } from '@nestjs/core';

export async function createUser(
  name: string,
  nickname?: string,
  email?: string,
  isAdmin: boolean = false
) {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCliModule, {
    logger: ['log', 'warn', 'error'],
  });
  const userService = ctx.get(UserService);

  const user = await userService.create({
    name,
    nickname: nickname ?? null,
    email: email ?? null,
    is_admin: isAdmin,
    auth0_id: null,
    picture_url: null,
    last_login: null,
    auth_provider: null,
  });

  outputJson(user);

  await ctx.close();
}
