import { Injectable, HttpException, HttpStatus, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserTokenDto } from '../utils/dto/userToken.dto';
import { tokens, validatedToken } from '../utils/interfaces/tokens.interface';
import { Token } from '../entities/token.entity';
import { TokenDataDto } from '../utils/dto/tokenData.dto';

@Injectable()
export class TokenService {
    constructor(
        @InjectRepository(Token)
        private readonly tokenRepository: Repository<Token>,
        private jwtService: JwtService,
    ) {}

    generateTokens(dto: TokenDataDto): tokens {
        try {
            const accessToken = this.jwtService.sign(dto, { expiresIn: '30m' });
            const refreshToken = this.jwtService.sign(dto);

            return {
                accessToken,
                refreshToken,
            };
        } catch (e) {
            throw new HttpException(
                { status: e.status || HttpStatus.INTERNAL_SERVER_ERROR, error: e.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async saveToken(dto: UserTokenDto, isRefresh = false): Promise<void> {
        const tokenData = await this.tokenRepository.findOne({ where: { user: { id: dto.userId } } });
        if (tokenData && !isRefresh) {
            throw new ConflictException('User is already signed in');
        }
        try {
            if (isRefresh) {
                await this.tokenRepository.update({ user: { id: dto.userId } }, { refreshToken: dto.refreshToken });
            } else {
                const token = this.tokenRepository.create({
                    user: { id: dto.userId },
                    refreshToken: dto.refreshToken,
                });
                await this.tokenRepository.save(token);
            }
        } catch (e) {
            throw new HttpException(
                { status: e.status || HttpStatus.INTERNAL_SERVER_ERROR, error: e.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async validateRefreshToken(refreshToken: string): Promise<validatedToken> {
        try {
            return this.jwtService.verify(refreshToken);
        } catch (e) {
            throw new HttpException(
                { status: e.status || HttpStatus.INTERNAL_SERVER_ERROR, error: e.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async getTokenByUserId(userId: number): Promise<string> {
        try {
            const dbToken = await this.tokenRepository.findOne({ where: { user: { id: userId } } });
            return dbToken?.refreshToken || null;
        } catch (e) {
            throw new HttpException(
                { status: e.status || HttpStatus.INTERNAL_SERVER_ERROR, error: e.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async removeToken(user): Promise<void> {
        try {
            await this.tokenRepository.delete({ user: { id: user.userId } });
        } catch (e) {
            throw new HttpException(
                { status: e.status || HttpStatus.INTERNAL_SERVER_ERROR, error: e.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
