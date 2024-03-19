import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Token } from './token.entity';
import { Article } from './article.entity';
import { Role } from './role.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', { unique: true, nullable: false })
    email: string;

    @Column('text', { nullable: false })
    password: string;

    @Column('text', { nullable: false, default: `["Viewer"]` })
    assignedRoles: string;

    @OneToOne(() => Token, (token) => token.user, { cascade: true })
    @JoinColumn({ name: 'tokenId' })
    token: Token;

    @OneToMany(() => Article, (article) => article.user, { cascade: true })
    @JoinColumn({ name: 'articleId' })
    article: Article[];

    @OneToOne(() => Role)
    @JoinColumn({ name: 'roleId' })
    role: Role;
}
