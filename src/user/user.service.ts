import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';
import { reqUser } from '../utils/interfaces/guardedRequest.interface';
import { Token } from '../entities/token.entity';
import { UserRole } from 'src/utils/constants/roles';
import { Article } from 'src/entities/article.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectEntityManager() private readonly entityManager: EntityManager,
    ) {}

    async switchRole(dto: { role: string; user: reqUser }): Promise<void> {
        const roleToSwitch = await this.roleRepository.findOne({ where: { name: dto.role } });
        if (!roleToSwitch) {
            throw new BadRequestException('This role does not exist');
        }
        const userData = await this.userRepository.findOne({ where: { id: dto.user.id } });
        console.log(userData.assignedRoles);
        const currentAssignedRoles = JSON.parse(userData.assignedRoles);
        if (!currentAssignedRoles.includes(dto.role)) {
            throw new ConflictException('This role is not allowed to switch for this user');
        }

        await this.userRepository.update(userData.id, { role: roleToSwitch });
    }

    async deleteAccount(reqUser: reqUser): Promise<void> {
        await this.entityManager.transaction(async (entityManager) => {
            await entityManager.delete(Token, { user: reqUser.id });
            const user = await entityManager.findOne(User, { where: { id: reqUser.id } });
            if (!user) {
                throw new BadRequestException('User not found');
            }
            const assignedRoles = JSON.parse(user.assignedRoles);
            if (!assignedRoles.includes(UserRole.Editor)) {
                await entityManager.delete(Article, { user: reqUser.id });
            }
            await entityManager.remove(user);
        });
    }
}
