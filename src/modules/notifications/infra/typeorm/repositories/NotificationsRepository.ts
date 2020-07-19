import { getMongoRepository, MongoRepository } from 'typeorm';
import INotificationsRepository from '../../../repositories/INotificationsRepository';
import Notification from '../schemas/Notification';
import ICreateNotificationDTO from '../../../dtos/ICreateNotificationDTO';

export default class NotificationsRepository
    implements INotificationsRepository {
    private ormRepository: MongoRepository<Notification>;

    constructor() {
        this.ormRepository = getMongoRepository(Notification, 'mongo');
    }

    public async create({
        content,
        recipient_id,
    }: ICreateNotificationDTO): Promise<Notification> {
        const notification = this.ormRepository.create({
            content,
            recipient_id,
        });

        await this.ormRepository.save(notification);

        return notification;
    }
}
