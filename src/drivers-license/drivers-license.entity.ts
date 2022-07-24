import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Expose } from 'class-transformer';
import { DOCUMENT_STATUS } from '../status/constants/enum.constants';
import { DRIVING_LICENCE_CATEGORIES } from './constants/enum.constants';

@Entity({ name: 'drivers_license' })
export class DriversLicenseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', type: 'varchar', length: 255 })
  @Expose()
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 255 })
  @Expose()
  lastName: string;

  @Column({ name: 'middle_name', type: 'varchar', length: 255 })
  @Expose()
  middleName: string;

  @Column({ name: 'date_issue', type: 'timestamptz' })
  @Expose()
  dateIssue: Date;

  @Column({ name: 'valid_until', type: 'timestamptz' })
  @Expose()
  validUntil: Date;

  @Column({
    name: 'car_class',
    type: 'enum',
    enum: DRIVING_LICENCE_CATEGORIES,
    array: true,
  })
  @Expose()
  carClass: DRIVING_LICENCE_CATEGORIES[];

  @Column({
    name: 'status',
    type: 'enum',
    enum: DOCUMENT_STATUS,
    default: DOCUMENT_STATUS.PENDING,
  })
  @Expose()
  status: DOCUMENT_STATUS;
  constructor(driversLicense: Partial<DriversLicenseEntity>) {
    Object.assign(this, driversLicense);
  }
}
