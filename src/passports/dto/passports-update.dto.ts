import {
  IsDate,
  MinDate,
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';
import {
  capitalizeTransform,
  cuttingCharactersAndCapitalize,
  stringToDate,
} from '../../global.helpers';

@Exclude()
export class PassportsUpdateDto {
  @Expose()
  @Transform(({ value }) => cuttingCharactersAndCapitalize(value, true))
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  firstName: string;

  @Expose()
  @Transform(({ value }) => cuttingCharactersAndCapitalize(value, true))
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  lastName: string;

  @Expose()
  @Transform(({ value }) => cuttingCharactersAndCapitalize(value, true))
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  middleName: string;

  @Expose()
  @Transform(({ value }) => stringToDate(value), { toClassOnly: true })
  @IsDate()
  @IsNotEmpty()
  @MinDate(new Date(1900, 1))
  dateBirth: Date;

  @Expose()
  @Transform(({ value }) => stringToDate(value), { toClassOnly: true })
  @IsDate()
  @IsNotEmpty()
  @MinDate(new Date(1900, 1))
  dateIssue: Date;

  @Expose()
  @Transform(({ value }) => capitalizeTransform(value), { toClassOnly: true })
  @IsString()
  @IsNotEmpty()
  issuedBy: string;

  @Expose()
  @Transform(({ value }) => capitalizeTransform(value), { toClassOnly: true })
  @IsString()
  @IsNotEmpty()
  series: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  number: number;
}
