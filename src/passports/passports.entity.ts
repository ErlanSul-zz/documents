import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { StatusEntity } from '../status/status.entity';
import { DOCUMENT_STATUS } from '../status/constants/enum.constants';

@Entity({ name: 'passports' })
export class PassportsEntity {
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

  @Column({ name: 'date_birth', type: 'timestamptz' })
  @Expose()
  dateBirth: Date;

  @Column({ name: 'series', type: 'varchar', length: 10 })
  @Expose()
  series: string;

  @Column({ name: 'number', type: 'integer' })
  @Expose()
  number: number;

  @Column({ name: 'date_issue', type: 'timestamptz' })
  @Expose()
  dateIssue: Date;

  @Column({ name: 'issued_by', type: 'varchar', length: 20 })
  @Expose()
  issuedBy: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: DOCUMENT_STATUS,
    default: DOCUMENT_STATUS.PENDING,
  })
  @Expose()
  status: DOCUMENT_STATUS;
  constructor(passports: Partial<PassportsEntity>) {
    Object.assign(this, passports);
  }
}
