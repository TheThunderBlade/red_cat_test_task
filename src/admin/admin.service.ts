import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async getAllUsers(page: number = 1, limit: number = 10): Promise<User[]> {
        return this.userRepository.find({
            relations: ['role'],
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async deleteUser(id: number): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        await this.userRepository.delete({ id });
    }
}
