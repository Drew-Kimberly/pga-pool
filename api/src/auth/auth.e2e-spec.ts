import * as request from 'supertest';

import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { Controller, Get, INestApplication, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

// Test controller with protected and public endpoints
@Controller('test')
class TestController {
  @Get('protected')
  protected() {
    return { message: 'This is protected' };
  }

  @Public()
  @Get('public')
  public() {
    return { message: 'This is public' };
  }
}

// Test module
@Module({
  controllers: [TestController],
})
class TestModule {}

describe('Auth E2E', () => {
  let app: INestApplication;

  describe('With AUTH_ENABLED=true and AUTH_REQUIRED=true', () => {
    beforeAll(async () => {
      const moduleRef: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            load: [
              () => ({
                AUTH_ENABLED: 'true',
                AUTH_REQUIRED: 'true',
                AUTH0_DOMAIN: 'test.auth0.com',
                AUTH0_AUDIENCE: 'https://test-api',
              }),
            ],
          }),
          TestModule,
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

    it('should return 401 for protected endpoint without token', () => {
      return request(app.getHttpServer()).get('/test/protected').expect(401);
    });

    it('should return 401 for protected endpoint with invalid token', () => {
      return request(app.getHttpServer())
        .get('/test/protected')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should allow access to public endpoint without token', () => {
      return request(app.getHttpServer())
        .get('/test/public')
        .expect(200)
        .expect({ message: 'This is public' });
    });
  });

  describe('With AUTH_ENABLED=false', () => {
    beforeAll(async () => {
      const moduleRef: TestingModule = await Test.createTestingModule({
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
          TestModule,
        ],
      }).compile();

      app = moduleRef.createNestApplication();

      const reflector = app.get(Reflector);
      const configService = app.get(ConfigService);
      app.useGlobalGuards(new JwtAuthGuard(reflector, configService));

      await app.init();
    });

    afterAll(async () => {
      await app.close();
    });

    it('should allow access to all endpoints without token', () => {
      return request(app.getHttpServer())
        .get('/test/protected')
        .expect(200)
        .expect({ message: 'This is protected' });
    });
  });

  describe('With AUTH_ENABLED=true and AUTH_REQUIRED=false', () => {
    beforeAll(async () => {
      const moduleRef: TestingModule = await Test.createTestingModule({
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
          TestModule,
        ],
      }).compile();

      app = moduleRef.createNestApplication();

      const reflector = app.get(Reflector);
      const configService = app.get(ConfigService);
      app.useGlobalGuards(new JwtAuthGuard(reflector, configService));

      await app.init();
    });

    afterAll(async () => {
      await app.close();
    });

    it('should allow access without token when AUTH_REQUIRED=false', () => {
      return request(app.getHttpServer())
        .get('/test/protected')
        .expect(200)
        .expect({ message: 'This is protected' });
    });
  });
});
