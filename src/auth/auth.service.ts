import * as bcrypt from 'bcrypt';
import {
    Injectable,
    HttpException,
    HttpStatus,
    ConflictException,
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto, SignInDto } from '../utils/dto/auth.dto';
import { UserTokenDto } from '../utils/dto/userToken.dto';
import { tokens } from '../utils/interfaces/tokens.interface';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { TokenService } from './tokens.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        private readonly tokenService: TokenService,
    ) {}

    async signUp(dto: SignUpDto): Promise<void> {
        try {
            const existedUser = await this.userRepository.findOne({ where: { email: dto.email } });
            if (existedUser) {
                throw new ConflictException('User with this email already exists');
            }

            const defaultRole = await this.roleRepository.findOne({ where: { name: 'Viewer' } });

            const hashedPassword = await bcrypt.hash(dto.password, 10);
            const user = await this.userRepository.create({ ...dto, password: hashedPassword, role: defaultRole });
            await this.userRepository.save(user);
        } catch (e) {
            throw new HttpException(
                { status: e.status || HttpStatus.INTERNAL_SERVER_ERROR, error: e.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async signIn(dto: SignInDto): Promise<tokens> {
        try {
            const user = await this.userRepository.findOne({ where: { email: dto.email }, relations: ['role'] });
            if (!user) {
                throw new NotFoundException('User with this email not found');
            }
            const password = await bcrypt.compare(dto.password, user.password);
            if (!password) {
                throw new BadRequestException('Invalid password');
            }
            const dbToken = await this.tokenService.getTokenByUserId(user.id);
            if (dbToken) {
                await this.tokenService.removeToken(user.id);
            }

            const tokens = this.tokenService.generateTokens({
                userId: user.id,
                email: user.email,
                role: user.role.name,
            });
            await this.tokenService.saveToken({
                userId: user.id,
                email: user.email,
                refreshToken: tokens.refreshToken,
            });

            return tokens;
        } catch (e) {
            throw new HttpException(
                { status: e.status || HttpStatus.INTERNAL_SERVER_ERROR, error: e.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async refresh(dto: UserTokenDto): Promise<tokens> {
        try {
            const userData = await this.tokenService.validateRefreshToken(dto.refreshToken);
            const tokenFromDb = await this.tokenService.getTokenByUserId(dto.userId);

            if (!userData || !tokenFromDb) {
                throw new UnauthorizedException('Token validation failed');
            }

            const user = await this.userRepository.findOne({ where: { id: userData.userId }, relations: ['role'] });
            const tokens = this.tokenService.generateTokens({
                userId: user.id,
                email: user.email,
                role: user.role.name,
            });
            await this.tokenService.saveToken(
                {
                    userId: user.id,
                    email: user.email,
                    refreshToken: tokens.refreshToken,
                },
                true,
            );

            return tokens;
        } catch (e) {
            throw new HttpException(
                { status: e.status || HttpStatus.INTERNAL_SERVER_ERROR, error: e.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async signOut(user): Promise<void> {
        try {
            await this.tokenService.removeToken(user);
        } catch (e) {
            throw new HttpException(
                { status: e.status || HttpStatus.INTERNAL_SERVER_ERROR, error: e.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
