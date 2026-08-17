import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async register(username: string, email: string, password: string) {
    const user = await this.usersService.create(username, email, password);

    const token = this.generateToken(user.id, user.email);

    return {
      user: { id: user.id, username: user.username, email: user.email },
      accessToken: token,
    };
  }



  async login(email: string, password: string) {
    const user = await this.usersService.findByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = this.generateToken(user.id, user.email);

    return {
      user: { id: user.id, username: user.username, email: user.email },
      accessToken: token,
    };
  }


  
  private generateToken(userId: string, email: string): string {
    return this.jwtService.sign({
      sub: userId,
      email,
    });
  }

  async logout(token: string): Promise<void> {
  const decoded = this.jwtService.decode(token) as { exp: number };

  if (!decoded?.exp) return;

  const now = Math.floor(Date.now() / 1000);
  const ttl = (decoded.exp - now) * 1000;
  console.log('TTL:', ttl);

  if (ttl > 0) {
    await this.cacheManager.set(`blacklist:${token}`, true, ttl);
    const check = await this.cacheManager.get(`blacklist:${token}`);
    console.log('SAVED IN CACHE:', check);
  }
}

  async isTokenBlackListed(token: string): Promise<boolean> {
    const result = await this.cacheManager.get(`blacklisted:${token}`);
    return result === 'blacklisted';
  }
}