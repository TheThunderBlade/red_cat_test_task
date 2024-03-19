import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', { nullable: false })
    name: string;

    @Column('text', { nullable: false })
    text: string;

    @ManyToOne(() => User, (user) => user.article)
    @JoinColumn({ name: 'userId' })
    user: User;
}
