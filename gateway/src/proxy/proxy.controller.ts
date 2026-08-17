import { Controller, All, Req, Res, UseGuards, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Public } from '../decorators/public.decorator';

@Controller()
export class ProxyController {
    constructor(
        private readonly httpService: HttpService,
        private readonly config: ConfigService
    ) {}


    @Public()
    @All('auth/register')
    proxyRegister(@Req() req: Request, @Res() res: Response) {
        return this.forward(req, res, this.config.get('AUTH_SERVICE_URL')!);
    }

    @Public()
    @All('auth/login')
    proxyLogin(@Req() req: Request, @Res() res: Response) {
        return this.forward(req, res, this.config.get('AUTH_SERVICE_URL')!);
    }

    @UseGuards(JwtAuthGuard)
    @All('auth/*path')
    proxyAuth(@Req() req: Request, @Res() res: Response) {
        return this.forward(req, res, this.config.get('AUTH_SERVICE_URL')!);
    }

    @UseGuards(JwtAuthGuard)
    @All('tasks/*path')
    proxyTasks(@Req() req: Request, @Res() res: Response) {
        return this.forward(req, res, this.config.get('TASK_SERVICE_URL')!);
    }

    @UseGuards(JwtAuthGuard)
    @All('tasks')
    ProxyTasksRoot(@Req() req: Request, @Res() res: Response) {
        return this.forward(req, res, this.config.get('TASK_SERVICE_URL')!);
    }
    

    private async forward(req: Request, res: Response, serviceUrl: string) {
        const url = `${serviceUrl}${req.path}${this.buildQueryString(req.query)}`;

        const user = req.user as { userId: string, email: string } | undefined;

        try {
            const response = await firstValueFrom(
                this.httpService.request({
                    method: req.method,
                    url,
                    data: req.body,
                    headers: {
                        'Content-Type': 'application/json',
                        ...(user && { 'x-user-id': user.userId}),
                        ...(req.headers.authorization && { 
                        'authorization': req.headers.authorization 
                    }),
                    },
                }),
            );

            return res.status(response.status).json(response.data);
        }
        catch (error: any) {
            const status = error.response?.status ?? 500;
            const data = error.response?.data ?? { message: 'Internal Server Error'};
            throw new HttpException(data, status);
        }
    }

    private buildQueryString(query: Record<string, any>): string {
        const params = new URLSearchParams(query).toString();
        return params ? `?${params}` : '';
    }

}