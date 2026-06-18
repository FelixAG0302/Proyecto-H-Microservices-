import {Injectable, ConflictException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import * as bcrypt from 'bcrypt';
import {User} from '../auth/entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {}

    async create(username: string, email: string, password: string): Promise<User> {
        const existing = await this.userRepo.findOne({ where: [{username}, {email}] });

        if (existing) {
            throw new ConflictException('Username or email already exists');
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = this.userRepo.create({ username, email, password: hashed });
        return this.userRepo.save(user);
    }

    async findByEmailWithPassword(email: string): Promise<User | null> {
        return this.userRepo
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.email = :email', { email })
        .getOne();
    }

    async findById(id: string): Promise<User | null>{
        return this.userRepo.findOne({ where: { id } });
    }
    
}