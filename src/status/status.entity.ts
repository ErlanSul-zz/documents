import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DOCUMENT_STATUS } from './constants/enum.constants';
import { Expose } from 'class-transformer';

@Entity({ name: 'status' })
export class StatusEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: DOCUMENT_STATUS,
  })
  @Expose()
  status: DOCUMENT_STATUS;
  constructor(status: Partial<StatusEntity>) {
    Object.assign(this, status);
  }
}
