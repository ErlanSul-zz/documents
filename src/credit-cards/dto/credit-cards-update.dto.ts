import {
  IsString,
  MinLength,
  MaxLength,
  IsDate,
  MinDate,
  IsNotEmpty,
} from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';
import {
  cuttingCharactersAndCapitalize,
  cardNumber,
  cardDateCheck,
} from '../../global.helpers';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class CreditCardsUpdateDto {
  @ApiProperty({ required: false })
  @Expose()
  @Transform(({ value }) => cuttingCharactersAndCapitalize(value, true))
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  firstName: string;

  @ApiProperty({ required: false })
  @Expose()
  @Transform(({ value }) => cuttingCharactersAndCapitalize(value, true))
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  lastName: string;

  @ApiProperty({ required: false })
  @Expose()
  @Transform(({ value }) => cardDateCheck(value), { toClassOnly: true })
  @IsDate()
  @IsNotEmpty()
  @MinDate(new Date(2000, 1))
  validUntil: Date;

  @ApiProperty({ required: false })
  @Expose()
  @IsString()
  @IsNotEmpty()
  @MinLength(16)
  @MaxLength(16)
  @Transform(({ value }) => cardNumber(value))
  number: string;
}
