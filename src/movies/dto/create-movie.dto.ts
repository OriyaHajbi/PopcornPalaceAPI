/* eslint-disable prettier/prettier */
import {
  IsString,
  IsInt,
  IsPositive,
  IsNotEmpty,
  Max,
  Min,
} from 'class-validator';

/* eslint-disable prettier/prettier */
export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  genre: string;

  @IsInt()
  @IsPositive()
  duration: number;

  @IsPositive()
  @Min(0)
  @Max(10)
  rating: number;

  @IsInt()
  @IsPositive()
  releaseYear: number;
}
