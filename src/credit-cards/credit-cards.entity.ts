import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Expose, Transform } from 'class-transformer';
import { cardNumber } from '../global.helpers';
import { DOCUMENT_STATUS } from '../status/constants/enum.constants';

@Entity({ name: 'credit_cards' })
export class CreditCardsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name', type: 'varchar', length: 255 })
  @Expose()
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 255 })
  @Expose()
  lastName: string;

  @Column({ name: 'number', type: 'varchar', length: 16 })
  @Expose()
  @Transform(({ value }) => cardNumber(value), { toPlainOnly: true })
  number: string;

  @Column({ name: 'valid_until', type: 'timestamptz' })
  @Expose()
  validUntil: Date;

  @Column({
    name: 'status',
    type: 'enum',
    enum: DOCUMENT_STATUS,
    default: DOCUMENT_STATUS.PENDING,
  })
  @Expose()
  status: DOCUMENT_STATUS;
  constructor(creditCards: Partial<CreditCardsEntity>) {
    Object.assign(this, creditCards);
  }
}
