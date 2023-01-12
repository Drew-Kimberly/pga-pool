import { UserService } from '../../../src/user/lib/user.service';
import { PgaPoolCliModule } from '../../cli.module';
import { outputJson } from '../../utils';

import { NestFactory } from '@nestjs/core';

export async function listUsers() {
  const ctx = await NestFactory.createApplicationContext(PgaPoolCliModule);
  const userService = ctx.get(UserService);

  const users = await userService.list();

  outputJson(users);

  await ctx.close();
}
