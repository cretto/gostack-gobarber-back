import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';
import IAppoitmentsRepository from '../repositories/IAppoitmentsRepositories';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppoitmentsRepository')
    private appoitmentsRepository: IAppoitmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appoitments = await this.appoitmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        year,
        month,
      },
    );

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (value, index) => index + 1,
    );

    const currentDate = Date.now();

    const availability = eachDayArray.map(day => {
      const compareDate = new Date(year, month - 1, day, 23, 59, 59);
      const appoitmentsInDay = appoitments.filter(appoitment => {
        return getDate(appoitment.date) === day;
      });

      return {
        day,
        available:
          isAfter(compareDate, currentDate) && appoitmentsInDay.length < 10,
      };
    });

    return availability;
  }
}
