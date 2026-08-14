import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthGuard} from '@nestjs/passport';
import {RegisterDto} from './dto/register.dto';
import {LoginDto} from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto.username, dto.email, dto.password);
    }

    @Post('Login')
    Login(@Body() dto: LoginDto) {
        return this.authService.login(dto.email, dto.password);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getMe(@Req() req) {
        return req.user;
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('logout')
    logout(@Req() req: any) {
        const token = req.headers.authorization?.split(' ')[1];
        return this.authService.logout(token);
    }
}
