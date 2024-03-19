import { IsNumber, IsString, IsEmail } from 'class-validator';

export class TokenDataDto {
    @IsNumber({}, { message: 'Must be a number' })
    readonly userId: number;
    @IsString({ message: 'Must be a string' })
    @IsEmail({}, { message: 'Invalid email address' })
    readonly email: string;
    @IsString({ message: 'Must be a string' })
    readonly role: string;
}
