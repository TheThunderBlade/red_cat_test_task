import { Response } from 'express';
import { Body, Controller, Delete, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../guards/auth.guard';
import { guardedRequest } from '../utils/interfaces/guardedRequest.interface';
import responceHelper, { ResponseHelper } from '../utils/helpers/responce.helper';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Post('/switchRole')
    async switchRole(@Req() req: guardedRequest, @Body() switchRoleDto: { role: string }): Promise<ResponseHelper> {
        const { user } = req;
        const { role } = switchRoleDto;

        await this.userService.switchRole({ role, user });

        return responceHelper({ status: 200, message: 'Role has been switched' });
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/deleteAccount')
    async deleteAccount(
        @Req() req: guardedRequest,
        @Res({ passthrough: true }) res: Response,
    ): Promise<ResponseHelper> {
        const { user } = req;
        await this.userService.deleteAccount(user);
        res.clearCookie('refreshToken');
        return responceHelper({ status: 200, message: 'Accound has been deleted' });
    }
}
