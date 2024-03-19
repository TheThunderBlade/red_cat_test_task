import { Controller, Delete, Get, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { UserRole } from 'src/utils/constants/roles';
import responceHelper, { ResponseHelper } from 'src/utils/helpers/responce.helper';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @SetMetadata('roles', UserRole.Admin)
    @Get('/getAll')
    async getAllArticles(@Query('page') page: number, @Query('limit') limit: number): Promise<ResponseHelper> {
        const users = await this.adminService.getAllUsers(page, limit);
        return responceHelper({ status: 200, data: users });
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @SetMetadata('roles', [UserRole.Admin])
    @Delete('/deleteUser')
    async deleteUser(@Query('id') id: number): Promise<ResponseHelper> {
        const users = await this.adminService.deleteUser(id);
        return responceHelper({ status: 200, message: 'User has been successfully deleted', data: users });
    }
}
