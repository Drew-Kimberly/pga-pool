import * as request from 'supertest';

import { HealthModule } from '../health/health.module';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthModule } from './auth.module';

import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('Auth Integration', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => ({
              AUTH_ENABLED: 'true',
              AUTH_REQUIRED: 'true',
              AUTH0_DOMAIN: 'test.auth0.com',
              AUTH0_AUDIENCE: 'https://test-api',
              DB_TYPE: 'postgres',
              DB_HOST: 'localhost',
              DB_PORT: 5432,
              DB_NAME: 'test',
              DB_USER: 'test',
              DB_PASSWORD: 'test',
            }),
          ],
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          database: 'test',
          username: 'test',
          password: 'test',
          entities: [],
          synchronize: false,
          logging: false,
        }),
        AuthModule,
        HealthModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    // Apply JWT auth guard globally (same as in main.ts)
    const reflector = app.get(Reflector);
    const configService = app.get(ConfigService);
    app.useGlobalGuards(new JwtAuthGuard(reflector, configService));

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Protected endpoints', () => {
    it('should return 401 for endpoints without @Public decorator when no token provided', async () => {
      // Create a test controller without @Public decorator
      const response = await request(app.getHttpServer()).get('/test-protected').expect(401);

      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it('should return 401 for endpoints without @Public decorator when invalid token provided', async () => {
      const response = await request(app.getHttpServer())
        .get('/test-protected')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });
  });

  describe('Public endpoints', () => {
    it('should allow access to health endpoint marked with @Public decorator', async () => {
      const response = await request(app.getHttpServer()).get('/health/up').expect(200);

      expect(response.text).toBe('OK');
    });
  });

  describe('Auth configuration', () => {
    it('should allow all requests when AUTH_ENABLED is false', async () => {
      // Create a new app instance with AUTH_ENABLED=false
      const moduleRef = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            load: [
              () => ({
                AUTH_ENABLED: 'false',
                AUTH0_DOMAIN: 'test.auth0.com',
                AUTH0_AUDIENCE: 'https://test-api',
              }),
            ],
          }),
          AuthModule,
          HealthModule,
        ],
      }).compile();

      const testApp = moduleRef.createNestApplication();
      const reflector = testApp.get(Reflector);
      const configService = testApp.get(ConfigService);
      testApp.useGlobalGuards(new JwtAuthGuard(reflector, configService));

      await testApp.init();

      // Should allow access without token
      await request(testApp.getHttpServer()).get('/health/up').expect(200);

      await testApp.close();
    });

    it('should allow requests without token when AUTH_REQUIRED is false', async () => {
      // Create a new app instance with AUTH_REQUIRED=false
      const moduleRef = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            load: [
              () => ({
                AUTH_ENABLED: 'true',
                AUTH_REQUIRED: 'false',
                AUTH0_DOMAIN: 'test.auth0.com',
                AUTH0_AUDIENCE: 'https://test-api',
              }),
            ],
          }),
          AuthModule,
          HealthModule,
        ],
      }).compile();

      const testApp = moduleRef.createNestApplication();
      const reflector = testApp.get(Reflector);
      const configService = testApp.get(ConfigService);
      testApp.useGlobalGuards(new JwtAuthGuard(reflector, configService));

      await testApp.init();

      // Should allow access without token when AUTH_REQUIRED=false
      await request(testApp.getHttpServer()).get('/health/up').expect(200);

      await testApp.close();
    });
  });
});
