import { UserService } from '../../../src/user/lib/user.service';
import { PgaPoolCliModule } from '../../cli.module';
import { outputJson } from '../../utils';

import { NestFactory } from '@nestjs/core';

export async function updateUser(
  id: string,
  name: string,
  nickname?: string,
  email?: string,
  isAdmin?: boolean
) {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCliModule, {
    logger: ['log', 'warn', 'error'],
  });
  const userService = ctx.get(UserService);

  let user = await userService.get(id);
  if (!user) {
    throw new Error(`User ${id} not found!`);
  }

  await userService.update({ id, name, nickname, email, is_admin: isAdmin });

  user = await userService.get(id);

  outputJson(user);

  await ctx.close();
}
