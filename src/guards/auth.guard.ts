import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { TokenDataDto } from '../utils/dto/tokenData.dto';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        try {
            const authHeader = req.headers.authorization;
            const bearer = authHeader.split(' ')[0];
            const accessToken = authHeader.split(' ')[1];
            const { refreshToken } = req.cookies;

            if (bearer !== 'Bearer' || !accessToken || !refreshToken) {
                throw new UnauthorizedException('The user is not authorized(Invalid token or token epsent)');
            }

            const user = this.jwtService.verify(accessToken) as TokenDataDto;

            req.user = user;
            return true;
        } catch (e) {
            throw new HttpException(
                { status: e.status || HttpStatus.INTERNAL_SERVER_ERROR, error: e.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
