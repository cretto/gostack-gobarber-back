import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Exclude, Expose } from 'class-transformer';
import configUpload from '../../../../../config/upload';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  email: string;

  @Column()
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    switch (configUpload.driver) {
      case 'disk':
        return this.avatar
          ? `${process.env.APP_API_URL}/files/uploads/${this.avatar}`
          : null;
      case 's3':
        return `https://${configUpload.config.aws.bucket}.s3.amazonaws.com/${this.avatar}`;

      default:
        return null;
    }
  }
}

export default User;
