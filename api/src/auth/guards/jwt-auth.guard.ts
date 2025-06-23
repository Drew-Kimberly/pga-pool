import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

export const IS_PUBLIC_KEY = 'isPublic';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Check if auth is disabled globally
    if (this.configService.get('AUTH_ENABLED') !== 'true') {
      return true;
    }

    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isPublic) {
      return true;
    }

    // Check if auth is required globally
    if (this.configService.get('AUTH_REQUIRED') !== 'true') {
      // Auth is enabled but not required - allow request to proceed
      // but still try to authenticate if token is present
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;
      
      if (!authHeader) {
        // No token provided and auth not required - allow access
        return true;
      }
    }

    return super.canActivate(context);
  }
}