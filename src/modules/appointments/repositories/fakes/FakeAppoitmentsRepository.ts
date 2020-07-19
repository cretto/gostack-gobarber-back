import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';
import Appointment from '../../infra/typeorm/entities/Appointment';
import IAppoitmentsRepository from '../IAppoitmentsRepositories';
import ICereateAppotimentsDTO from '../../dtos/ICreateAppoitmentsDTO';
import IFindAllInMonthFromProviderDTO from '../../dtos/IFindAllMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '../../dtos/IFindAllInDayFromProviderDTO';

class FakeAppoitmentsRepository implements IAppoitmentsRepository {
    private appoitments: Appointment[] = [];

    public async findByDate(
        date: Date,
        provider_id: string,
    ): Promise<Appointment | undefined> {
        const findAppoitment = this.appoitments.find(
            appoitment =>
                isEqual(appoitment.date, date) &&
                appoitment.provider_id === provider_id,
        );
        return findAppoitment;
    }

    public async findAllInDayFromProvider({
        provider_id,
        day,
        month,
        year,
    }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
        const appoitments = this.appoitments.filter(
            appoint =>
                appoint.provider_id === provider_id &&
                getDate(appoint.date) === day &&
                getMonth(appoint.date) + 1 === month &&
                getYear(appoint.date) === year,
        );

        return appoitments;
    }

    public async findAllInMonthFromProvider({
        provider_id,
        month,
        year,
    }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
        const appoitments = this.appoitments.filter(
            appoint =>
                appoint.provider_id === provider_id &&
                getMonth(appoint.date) + 1 === month &&
                getYear(appoint.date) === year,
        );

        return appoitments;
    }

    public async create({
        user_id,
        provider_id,
        date,
    }: ICereateAppotimentsDTO): Promise<Appointment> {
        const appoitment = new Appointment();

        Object.assign(appoitment, { id: uuid(), date, provider_id, user_id });

        this.appoitments.push(appoitment);

        return appoitment;
    }
}

export default FakeAppoitmentsRepository;
