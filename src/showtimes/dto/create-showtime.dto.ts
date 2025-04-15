/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Validate,
} from 'class-validator';
import { IsEndTimeAfterStartTimeConstraint } from 'src/validator/isEndAfterStartTime';

/* eslint-disable prettier/prettier */
export class CreateShowtimeDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  movieId: number;

  @IsString()
  @IsNotEmpty()
  theater: string;

  @Type(() => Date)
  @IsDate()
  startTime: Date;

  @Type(() => Date)
  @IsDate()
  @Validate(IsEndTimeAfterStartTimeConstraint) // Use the custom validator
  endTime: Date;

  @IsPositive()
  @IsNotEmpty()
  price: number;
}
