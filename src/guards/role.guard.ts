import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../utils/constants/roles';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRole = this.reflector.get<UserRole[]>('roles', context.getHandler());
        if (!requiredRole) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        return requiredRole.includes(user.role);
    }
}
