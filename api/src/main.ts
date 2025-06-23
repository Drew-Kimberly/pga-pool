import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { AppModule } from './app.module';

import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] });

  app.enableCors();
  app.enableShutdownHooks();

  // Apply JWT auth guard globally
  const reflector = app.get(Reflector);
  const configService = app.get(ConfigService);
  app.useGlobalGuards(new JwtAuthGuard(reflector, configService));

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
