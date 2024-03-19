import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.PRIVATE_KEY,
            signOptions: {
                expiresIn: '30d',
            },
        }),
        TypeOrmModule.forFeature([User, Role]),
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
