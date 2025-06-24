import { JwtAuthGuard } from './jwt-auth.guard';

import { ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;
  let configService: ConfigService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    reflector = module.get<Reflector>(Reflector);
    configService = module.get<ConfigService>(ConfigService);
    guard = new JwtAuthGuard(reflector, configService);
  });

  const createMockExecutionContext = (authHeader?: string): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: authHeader,
          },
        }),
      }),
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
    } as unknown as ExecutionContext;
  };

  describe('canActivate', () => {
    it('should return true when AUTH_ENABLED is not true', () => {
      jest.spyOn(configService, 'get').mockReturnValue('false');
      const context = createMockExecutionContext();

      const result = guard.canActivate(context);

      expect(result).toBe(true);
      expect(configService.get).toHaveBeenCalledWith('AUTH_ENABLED');
    });

    it('should return true when route is marked as public', () => {
      jest.spyOn(configService, 'get').mockReturnValue('true');
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);
      const context = createMockExecutionContext();

      const result = guard.canActivate(context);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith('isPublic', [
        expect.any(Function),
        expect.any(Function),
      ]);
    });

    it('should return true when AUTH_REQUIRED is not true and no auth header', () => {
      jest.spyOn(configService, 'get').mockImplementation((key) => {
        if (key === 'AUTH_ENABLED') return 'true';
        if (key === 'AUTH_REQUIRED') return 'false';
        return undefined;
      });
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      const context = createMockExecutionContext();

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should call parent canActivate when AUTH_REQUIRED is not true but auth header exists', () => {
      jest.spyOn(configService, 'get').mockImplementation((key) => {
        if (key === 'AUTH_ENABLED') return 'true';
        if (key === 'AUTH_REQUIRED') return 'false';
        return undefined;
      });
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      const context = createMockExecutionContext('Bearer token');

      // Mock the parent canActivate method
      const parentCanActivate = jest.spyOn(
        Object.getPrototypeOf(Object.getPrototypeOf(guard)),
        'canActivate'
      );
      parentCanActivate.mockReturnValue(true);

      const result = guard.canActivate(context);

      expect(parentCanActivate).toHaveBeenCalledWith(context);
      expect(result).toBe(true);
    });

    it('should call parent canActivate when AUTH_REQUIRED is true', () => {
      jest.spyOn(configService, 'get').mockImplementation((key) => {
        if (key === 'AUTH_ENABLED') return 'true';
        if (key === 'AUTH_REQUIRED') return 'true';
        return undefined;
      });
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      const context = createMockExecutionContext('Bearer token');

      // Mock the parent canActivate method
      const parentCanActivate = jest.spyOn(
        Object.getPrototypeOf(Object.getPrototypeOf(guard)),
        'canActivate'
      );
      parentCanActivate.mockReturnValue(true);

      const result = guard.canActivate(context);

      expect(parentCanActivate).toHaveBeenCalledWith(context);
      expect(result).toBe(true);
    });
  });
});
