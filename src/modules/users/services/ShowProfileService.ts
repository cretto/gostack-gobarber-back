import { injectable, inject } from 'tsyringe';
import IUserRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';
import AppError from '../../../shared/errors/AppError';

@injectable()
export default class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private userRepositry: IUserRepository,
  ) {}

  public async execute(user_id: string): Promise<User> {
    const user = await this.userRepositry.findById(user_id);
    if (!user) {
      throw new AppError('User not found');
    }
    return user;
  }
}
