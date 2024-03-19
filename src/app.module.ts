import { join } from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { ArticleModule } from './article/article.module';
import configImport from './utils/configs';
import { config } from 'dotenv';
config();

@Module({
    imports: [
        configImport,
        TypeOrmModule.forRootAsync({
            imports: [configImport],
            inject: [ConfigService],
            useFactory: (sonfigService: ConfigService) => ({
                type: 'postgres',
                host: sonfigService.get('POSTGRES_HOST'),
                port: sonfigService.get('POSTGRESS_PORT'),
                username: sonfigService.get('POSTGRES_USER'),
                password: sonfigService.get('POSTGRESS_PASSWORD'),
                database: sonfigService.get('POSTGRES_DB'),
                entities: [join(__dirname, '**', '*.entity.{ts,js}')],
                synchronize: false,
            }),
        }),
        AuthModule,
        UserModule,
        AdminModule,
        ArticleModule,
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class AppModule {}
