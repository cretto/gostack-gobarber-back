import Appointment from '../infra/typeorm/entities/Appointment';
import ICereateAppotimentsDTO from '../dtos/ICreateAppoitmentsDTO';
import IFindAllInMonthFromProviderDTO from '../dtos/IFindAllMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '../dtos/IFindAllInDayFromProviderDTO';

export default interface IAppoitmentsRepository {
    create(data: ICereateAppotimentsDTO): Promise<Appointment>;
    findByDate(
        date: Date,
        provider_id: string,
    ): Promise<Appointment | undefined>;
    findAllInDayFromProvider(
        data: IFindAllInDayFromProviderDTO,
    ): Promise<Appointment[]>;
    findAllInMonthFromProvider(
        data: IFindAllInMonthFromProviderDTO,
    ): Promise<Appointment[]>;
}
