import { uuid } from 'uuidv4';
import IUserRepository from '../IUsersRepository';
import User from '../../infra/typeorm/entities/User';
import ICreateUserDTO from '../../dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '../../dtos/IFindAllProvidersDTO';

class FakeUsersRepository implements IUserRepository {
    private users: User[] = [];

    public async findAlProviders(data: IFindAllProvidersDTO): Promise<User[]> {
        if (data.except_user_id) {
            const filteredUsers = this.users.filter(
                user => user.id !== data.except_user_id,
            );
            return filteredUsers;
        }
        return this.users;
    }

    public async findById(id: string): Promise<User | undefined> {
        const user = this.users.find(findUser => findUser.id === id);
        return user;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const user = this.users.find(findUser => findUser.email === email);
        return user;
    }

    public async create(userData: ICreateUserDTO): Promise<User> {
        const user = new User();

        Object.assign(user, { id: uuid() }, userData);
        this.users.push(user);
        return user;
    }

    public async save(user: User): Promise<User> {
        const findIndex = this.users.findIndex(findUser => user.id === user.id);
        this.users[findIndex] = user;
        return user;
    }
}

export default FakeUsersRepository;
