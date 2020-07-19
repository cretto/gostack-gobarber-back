import { container } from 'tsyringe';

import '../../modules/users/providers';

import './providers';

import IAppointmentsRepository from '../../modules/appointments/repositories/IAppoitmentsRepositories';
import AppoitmentsRepository from '../../modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import IUsersRepository from '../../modules/users/repositories/IUsersRepository';
import UsersRepository from '../../modules/users/infra/typeorm/repositories/UsersRepository';

import UserTokensRepository from '../../modules/users/infra/typeorm/repositories/UserTokensRepository';
import IUserTokensRepository from '../../modules/users/repositories/IUserTokenRepository';

import INotificationsRepository from '../../modules/notifications/repositories/INotificationsRepository';
import NotificationsRepository from '../../modules/notifications/infra/typeorm/repositories/NotificationsRepository';

container.registerSingleton<IAppointmentsRepository>(
  'AppoitmentsRepository',
  AppoitmentsRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<INotificationsRepository>(
  'NotificationsRepository',
  NotificationsRepository,
);
