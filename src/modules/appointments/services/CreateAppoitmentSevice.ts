import { injectable, inject } from 'tsyringe';
import { startOfHour, isBefore, getHours, format } from 'date-fns';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import Appointment from '../infra/typeorm/entities/Appointment';
import AppError from '../../../shared/errors/AppError';
import IAppoitmentsRepository from '../repositories/IAppoitmentsRepositories';
import INotificationsRepository from '../../notifications/repositories/INotificationsRepository';

interface IRequest {
  user_id: string;
  provider_id: string;
  date: Date;
}

@injectable()
class CreateAppoitmentService {
  constructor(
    @inject('AppoitmentsRepository')
    private appoitmentsRepository: IAppoitmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    user_id,
    date,
    provider_id,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appoitment on a past date ");
    }

    if (user_id === provider_id) {
      throw new AppError('You can not create an appoitment with yourself');
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        ' You can only create an appoitment beteewen 8am and 5pm',
      );
    }

    const findAppoitntmentInTheSameDate = await this.appoitmentsRepository.findByDate(
      appointmentDate,
      provider_id,
    );

    if (findAppoitntmentInTheSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = await this.appoitmentsRepository.create({
      user_id,
      provider_id,
      date: appointmentDate,
    });

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo Agendamento para o dia ${format(
        appointmentDate,
        "dd/MM/yyyy 'às' HH:mm'h'",
      )}`,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d',
      )}`,
    );

    return appointment;
  }
}

export default CreateAppoitmentService;
