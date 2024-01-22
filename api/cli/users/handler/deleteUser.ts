import { UserService } from '../../../src/user/lib/user.service';
import { PgaPoolCliModule } from '../../cli.module';
import { outputJson } from '../../utils';

import { NestFactory } from '@nestjs/core';

export async function deleteUser(id: string) {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCliModule, {
    logger: ['log', 'warn', 'error'],
  });
  const userService = ctx.get(UserService);

  const user = await userService.delete(id);
  if (!user) {
    throw new Error(`User ${id} not found!`);
  }

  outputJson(user);

  await ctx.close();
}
