import FakeCacheProvider from '../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '../../../shared/errors/AppError';
import FakeAppoitmentsRepositroy from '../repositories/fakes/FakeAppoitmentsRepository';
import CreateAppoitmentService from './CreateAppoitmentSevice';
import FakeNotificationsRepository from '../../notifications/repositories/fakes/FakeNotificationsRepository';

let fakeAppoitmentsRepository: FakeAppoitmentsRepositroy;
let createAppoitment: CreateAppoitmentService;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateAppoitment', () => {
  beforeEach(() => {
    fakeAppoitmentsRepository = new FakeAppoitmentsRepositroy();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppoitment = new CreateAppoitmentService(
      fakeAppoitmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appoitment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    const appoitment = await createAppoitment.execute({
      date: new Date(2020, 4, 10, 13),
      user_id: '1111111895',
      provider_id: '154651531',
    });

    expect(appoitment).toHaveProperty('id');
    expect(appoitment.provider_id).toBe('154651531');
  });

  it('should not be able to create two appoitments on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appoitmentDate = new Date(2020, 4, 10, 13);

    await createAppoitment.execute({
      date: appoitmentDate,
      user_id: '41984859',
      provider_id: '154651531',
    });

    await expect(
      createAppoitment.execute({
        user_id: '61849',
        date: appoitmentDate,
        provider_id: '154651531',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appoitment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppoitment.execute({
        user_id: '61849',
        date: new Date(2020, 4, 10, 11),
        provider_id: '154651531',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appoitment with user being the provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppoitment.execute({
        user_id: '61849',
        date: new Date(2020, 4, 10, 13),
        provider_id: '61849',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appoitment before 8 am and after 5 pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppoitment.execute({
        user_id: 'user-id',
        date: new Date(2020, 4, 11, 7),
        provider_id: 'provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppoitment.execute({
        user_id: 'user-id',
        date: new Date(2020, 4, 11, 18),
        provider_id: 'provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
