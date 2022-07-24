import {
  IsDate,
  MinDate,
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';
import {
  cuttingCharactersAndCapitalize,
  queryArrayStringTransform,
  stringToDate,
} from '../../global.helpers';
import { DRIVING_LICENCE_CATEGORIES } from '../constants/enum.constants';

@Exclude()
export class DriversLicenseUpdateDto {
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
  @MinDate(new Date(2022, 7))
  validUntil: Date;

  @Expose()
  @Transform(({ value }) => stringToDate(value), { toClassOnly: true })
  @IsDate()
  @IsNotEmpty()
  @MinDate(new Date(1900, 1))
  dateIssue: Date;

  @Expose()
  @Transform(({ value }) => queryArrayStringTransform(value))
  @IsNotEmpty()
  @IsEnum(DRIVING_LICENCE_CATEGORIES, { each: true })
  carClass: DRIVING_LICENCE_CATEGORIES[];
}
