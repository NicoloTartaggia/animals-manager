import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDaoService } from '../dao/auth-dao/auth-dao.service';
import { IUser } from './interfaces/user.interface';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
    @Inject(AuthDaoService) private readonly authDao: AuthDaoService;

    constructor(
        private jwtService: JwtService
    ) {}

    async signUp(signUpDto: SignUpDto): Promise<string> {
        const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
        const createdUser = await this.authDao.signUp(signUpDto.username, hashedPassword, signUpDto.role);
        return this.jwtService.sign({username: createdUser.username, role: createdUser.role});
    }

    async signIn(signInDto: SignInDto): Promise<string> {
        const user = await this.authDao.getUser(signInDto.username);
        if (!user) {
            throw new NotFoundException(`Auth signIn error - user with name ${signInDto.username} not found`);
        }
        const passwordMatch = await bcrypt.compare(signInDto.password, user.password);
        if (!passwordMatch) {
            throw new UnauthorizedException('Auth signIn error - Invalid login credentials');
        }
        const token = this.jwtService.sign({username: user.username, role: user.role}); 
        return token;
    }

    async getUser(username: string): Promise<IUser> {
        const user = await this.authDao.getUser(username);
        if (!user) {
            throw new NotFoundException(`Auth getUser error - user with name ${username} not found`);
        }
        return user;
    }
}
