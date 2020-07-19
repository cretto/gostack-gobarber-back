import FakeCacheProvider from '../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppoitmentsRepository from '../repositories/fakes/FakeAppoitmentsRepository';
import ListProviderAppoitmentsService from './ListProvidersAppointmentsService';

let fakeAppointmentsRepository: FakeAppoitmentsRepository;
let listProviderProviderAppoitments: ListProviderAppoitmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppoitments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppoitmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviderProviderAppoitments = new ListProviderAppoitmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list all appointments on a specific day', async () => {
    const appoitment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    const appoitment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    const appointments = await listProviderProviderAppoitments.execute({
      provider_id: 'provider',
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(appointments).toEqual(
      expect.arrayContaining([appoitment1, appoitment2]),
    );
  });
});
