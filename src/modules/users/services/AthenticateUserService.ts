import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import authConfig from '../../../config/auth';
import AppError from '../../../shared/errors/AppError';
import IUserRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
    email: string;
    password: string;
}

@injectable()
class AthenticateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({
        email,
        password,
    }: IRequest): Promise<{ user: User; token: string }> {
        const user = await this.usersRepository.findByEmail(email);
        if (!user) {
            throw new AppError('Incorrect email/password combination', 401);
        }

        // user.password - Senha criptografada
        // password - Senha não criptografada

        const passwordMatched = await this.hashProvider.compareHash(
            password,
            user.password,
        );
        if (!passwordMatched) {
            throw new AppError('Incorrect email/password combination', 401);
        }

        const token = sign({}, authConfig.jwt.secret, {
            subject: user.id,
            expiresIn: authConfig.jwt.expiresIn,
        });

        return {
            user,
            token,
        };
    }
}

export default AthenticateUserService;
