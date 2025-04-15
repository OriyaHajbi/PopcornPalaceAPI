/* eslint-disable prettier/prettier */
import { IsString, IsInt, IsPositive, IsNotEmpty } from 'class-validator';

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
  rating: number;

  @IsInt()
  @IsPositive()
  release_year: number;
}
