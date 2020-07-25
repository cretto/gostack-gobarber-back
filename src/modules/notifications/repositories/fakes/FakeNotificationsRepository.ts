import { ObjectId } from 'mongodb';
import INotificationsRepository from '../INotificationsRepository';
import Notification from '../../infra/typeorm/schemas/Notification';
import ICreateNotificationDTO from '../../dtos/ICreateNotificationDTO';

export default class FakeNotificationsRepository
  implements INotificationsRepository {
  private notifications: Notification[] = [];

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();
    Object.assign(notification, {
      id: new ObjectId(),
      content,
      recipient_id,
    });
    this.notifications.push(notification);
    return notification;
  }
}
