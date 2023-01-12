import { UserService } from '../../../src/user/lib/user.service';
import { PgaPoolCliModule } from '../../cli.module';
import { outputJson } from '../../utils';

import { NestFactory } from '@nestjs/core';

export async function getUser(id: string) {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCliModule);
  const userService = ctx.get(UserService);

  const user = await userService.get(id);
  if (!user) {
    throw new Error(`User ${id} not found!`);
  }

  outputJson(user);

  await ctx.close();
}
