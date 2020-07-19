import { injectable, inject } from "tsyringe";
import IUserRepository from "../repositories/IUsersRepository";
import AppError from "../../../shared/errors/AppError";
import IUserTokensRepository from "../repositories/IUserTokenRepository";
import BCryptHashProvider from "../providers/HashProvider/implementations/BCryptHashProvider";
import IHashProvider from "../providers/HashProvider/models/IHashProvider";
import { differenceInHours, addHours, isAfter } from "date-fns";


interface IRequest{
    token: string;
    password: string;
}

@injectable()
export default class ResetPasswordService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUserRepository,

        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider
    ){}

    public async execute({password, token}: IRequest): Promise<void>{
        const userToken = await this.userTokensRepository.findByToken(token);
        if(!userToken){
            throw new AppError('user token does not exists');
        }
        const user = await this.usersRepository.findById(userToken?.user_id);

        if(!user){
            throw new AppError('User does not exists')
        }

        const tokenCreatedAt = userToken.created_at;
        const compareDate = addHours(tokenCreatedAt, 2);

        if(isAfter(Date.now(), compareDate)){
            throw new AppError('Token Expired')
        }

        user.password = await this.hashProvider.generateHash(password);

        await this.usersRepository.save(user)

    }

}
