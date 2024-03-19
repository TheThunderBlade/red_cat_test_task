import { IsNumber, IsString } from 'class-validator';

export class ArticleBodyDto {
    @IsString({ message: 'Must be a string' })
    readonly name: string;
    @IsString({ message: 'Must be a string' })
    readonly text: string;
}

export class ArticleWithIdDto extends ArticleBodyDto {
    @IsNumber({}, { message: 'Must be a number' })
    id: number;
}
