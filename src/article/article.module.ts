import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Article } from '../entities/article.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.PRIVATE_KEY,
            signOptions: {
                expiresIn: '30d',
            },
        }),
        TypeOrmModule.forFeature([User, Article]),
    ],
    controllers: [ArticleController],
    providers: [ArticleService],
})
export class ArticleModule {}
