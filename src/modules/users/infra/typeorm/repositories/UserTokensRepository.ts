import { getRepository, Repository } from 'typeorm';
import User from '../entities/User';
import IUserTokensRepository from '../../../repositories/IUserTokenRepository';
import UserToken from '../entities/UserToken';

class UserTokensRepository implements IUserTokensRepository {

    private ormRepository: Repository<UserToken>;

    constructor() {
        this.ormRepository = getRepository(UserToken);
    }


    public async findByToken(token: string): Promise<UserToken | undefined>{
        const userToken = await this.ormRepository.findOne({
            where: { token }
        })

        return userToken;
    }

    public async generate(user_id: string): Promise<UserToken>{
        const token = this.ormRepository.create({
            user_id
        })

        await this.ormRepository.save(token)

        return token;
    }

}

export default UserTokensRepository;
