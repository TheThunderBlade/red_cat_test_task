import { Response } from 'express';
import { Controller, Post, Body, Res, Req, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../guards/auth.guard';
import { guardedRequest } from '../utils/interfaces/guardedRequest.interface';
import responceHelper from '../utils/helpers/responce.helper';
import { ResponseHelper } from '../utils/helpers/responce.helper';
import { SignInDto, SignUpDto } from '../utils/dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signUp')
    async signUp(@Body() signUpDto: SignUpDto): Promise<ResponseHelper> {
        await this.authService.signUp(signUpDto);

        return responceHelper({ status: 200, message: 'User has been successfully created' });
    }

    @Post('/signIn')
    async signIn(@Res({ passthrough: true }) res: Response, @Body() signInDto: SignInDto): Promise<ResponseHelper> {
        const token = await this.authService.signIn(signInDto);

        res.cookie('refreshToken', token.refreshToken);

        return responceHelper({ status: 200, data: token.accessToken });
    }

    @UseGuards(JwtAuthGuard)
    @Get('/refresh')
    async refresh(@Req() req: guardedRequest, @Res({ passthrough: true }) res: Response): Promise<ResponseHelper> {
        const { user } = req;
        const { refreshToken } = req.cookies;

        const tokens = await this.authService.refresh({ userId: user.id, email: user.email, refreshToken });
        res.cookie('refreshToken', tokens.refreshToken);

        return responceHelper({ status: 200, data: tokens.accessToken });
    }

    @UseGuards(JwtAuthGuard)
    @Get('/signOut')
    async signOut(@Req() req: guardedRequest, @Res({ passthrough: true }) res: Response): Promise<ResponseHelper> {
        const { user } = req;

        await this.authService.signOut(user);
        res.clearCookie('refreshToken');

        return responceHelper({ status: 200, message: 'User has been successfully signed out' });
    }
}
