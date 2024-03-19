import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/entities/article.entity';
import { User } from 'src/entities/user.entity';
import { ArticleBodyDto, ArticleWithIdDto } from 'src/utils/dto/article.dto';
import { reqUser } from 'src/utils/interfaces/guardedRequest.interface';
import { UserRole } from 'src/utils/constants/roles';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Article)
        private readonly articleRepository: Repository<Article>,
    ) {}

    async getAllArticles(page: number = 1, limit: number = 10): Promise<Article[]> {
        return this.articleRepository.find({
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async createArticle(user: reqUser, dto: ArticleBodyDto): Promise<Article> {
        const userData = await this.userRepository.findOne({ where: { id: user.id } });
        const article = this.articleRepository.create({ ...dto, user: userData });
        await this.articleRepository.save(article);
        return article;
    }

    async updateArticle(user, dto: ArticleWithIdDto): Promise<void> {
        const article = await this.articleRepository.findOne({ where: { id: dto.id } });
        if (!article) {
            throw new NotFoundException('Article not found');
        }
        const criteria = { id: dto.id, user: { id: user.userId } };
        if (user.role === UserRole.Admin) {
            delete criteria.user;
        }
        await this.articleRepository.update(criteria, { name: dto.name, text: dto.text });
    }

    async deleteArticle(user, id: number): Promise<void> {
        const article = await this.articleRepository.findOne({ where: { id } });
        if (!article) {
            throw new NotFoundException('Article not found');
        }
        const criteria = { id, user: { id: user.userId } };
        if (user.role === UserRole.Admin) {
            delete criteria.user;
        }
        await this.articleRepository.delete(criteria);
    }
}
