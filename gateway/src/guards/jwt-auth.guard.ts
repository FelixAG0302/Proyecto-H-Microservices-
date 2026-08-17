import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
  const request = context.switchToHttp().getRequest();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('IS PUBLIC:', isPublic);

    if (isPublic) return true;

    const isValid = await super.canActivate(context) as boolean;
    console.log('IS VALID:', isValid);  // ← agregar aquí

    if (!isValid) return false;

    const token = request.headers.authorization?.split(' ')[1];

    if (!token) return false;

    const isBlacklisted = await this.cacheManager.get(`blacklist:${token}`);
    console.log('IS BLACKLISTED:', isBlacklisted);

    if (isBlacklisted) {
      throw new UnauthorizedException('Token revocado');
    }
    

    return true;
  }
}
