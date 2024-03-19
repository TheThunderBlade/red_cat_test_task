import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Token {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', { nullable: false })
    refreshToken: string;

    @OneToOne(() => User, (user) => user.token)
    @JoinColumn({ name: 'userId' })
    user: User;
}
