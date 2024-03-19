import { Body, Controller, Delete, Get, Post, Query, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/role.guard';
import responceHelper, { ResponseHelper } from '../utils/helpers/responce.helper';
import { ArticleService } from './article.service';
import { UserRole } from '../utils/constants/roles';
import { ArticleBodyDto, ArticleWithIdDto } from 'src/utils/dto/article.dto';
import { guardedRequest } from 'src/utils/interfaces/guardedRequest.interface';

@Controller('article')
export class ArticleController {
    constructor(private articleService: ArticleService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @SetMetadata('roles', [UserRole.Admin, UserRole.Editor, UserRole.Viewer])
    @Get('/getAll')
    async getAllArticles(@Query('page') page: number, @Query('limit') limit: number): Promise<ResponseHelper> {
        const articles = await this.articleService.getAllArticles(page, limit);
        return responceHelper({ status: 200, data: articles });
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @SetMetadata('roles', [UserRole.Editor])
    @Post('/create')
    async createArticle(@Req() req: guardedRequest, @Body() articleBody: ArticleBodyDto): Promise<ResponseHelper> {
        const { user } = req;
        const article = await this.articleService.createArticle(user, articleBody);
        return responceHelper({ status: 200, data: article });
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @SetMetadata('roles', [UserRole.Admin, UserRole.Editor])
    @Post('/update')
    async updateArticle(@Req() req: guardedRequest, @Body() articleBody: ArticleWithIdDto): Promise<ResponseHelper> {
        const { user } = req;
        await this.articleService.updateArticle(user, articleBody);
        return responceHelper({ status: 200, message: 'Article has been updated' });
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @SetMetadata('roles', [UserRole.Admin, UserRole.Editor])
    @Delete('/delete')
    async deleteArticle(@Req() req: guardedRequest, @Query('id') id: number): Promise<ResponseHelper> {
        const { user } = req;
        await this.articleService.deleteArticle(user, id);
        return responceHelper({ status: 200, message: 'Article has been deleted' });
    }
}
