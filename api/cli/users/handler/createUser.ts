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
  });

  outputJson(user);

  await ctx.close();
}
