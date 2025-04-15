/* eslint-disable prettier/prettier */
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsPositive,
  Validate,
} from 'class-validator';
import { IsEndTimeAfterStartTimeConstraint } from 'src/validator/isEndAfterStartTime';

/* eslint-disable prettier/prettier */
export class CreateShowtimeDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  movieId: number;

  @IsInt()
  @IsPositive()
  theaterId: number;

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
