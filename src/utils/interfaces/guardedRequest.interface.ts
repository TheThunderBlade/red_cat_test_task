import { Request } from 'express';

export interface reqUser {
    id: number;
    email: string;
    role: string;
}

export interface guardedRequest extends Request {
    user: reqUser;
}
