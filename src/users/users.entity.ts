import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { PassportsEntity } from '../passports/passports.entity';
import { DriversLicenseEntity } from '../drivers-license/drivers-license.entity';
import { CreditCardsEntity } from '../credit-cards/credit-cards.entity';
import { USER_ROLES } from './constants/enum.constants';

@Entity({ name: 'users' })
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'username', type: 'varchar', length: 255, unique: true })
  @Expose()
  username: string;

  @Column({ name: 'documents_confirmed', type: 'boolean', default: false })
  @Expose()
  documentsConfirmed: boolean;

  @Column({ name: 'password', type: 'varchar', length: 100 })
  password: string;

  @OneToOne(() => PassportsEntity)
  @JoinColumn({ name: 'passport_id' })
  @Expose()
  passportId: PassportsEntity;

  @OneToOne(() => DriversLicenseEntity)
  @JoinColumn({ name: 'drivers_license_id' })
  @Expose()
  driversLicenseId: DriversLicenseEntity;

  @OneToOne(() => CreditCardsEntity)
  @JoinColumn({ name: 'credit_cards_id' })
  @Expose()
  creditCardsId: CreditCardsEntity;

  @Column({ name: 'roles', type: 'enum', enum: USER_ROLES, array: true })
  @Expose()
  roles: USER_ROLES[];

  constructor(users: Partial<UsersEntity>) {
    Object.assign(this, users);
  }
}
