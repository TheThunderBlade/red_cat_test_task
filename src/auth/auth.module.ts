import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Token } from '../entities/token.entity';
import { TokenService } from './tokens.service';
config();

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.PRIVATE_KEY,
            signOptions: {
                expiresIn: '30d',
            },
        }),
        TypeOrmModule.forFeature([User, Role, Token]),
    ],
    controllers: [AuthController],
    providers: [AuthService, TokenService],
})
export class AuthModule {}
