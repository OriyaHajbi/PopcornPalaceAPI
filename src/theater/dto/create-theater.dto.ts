/* eslint-disable prettier/prettier */
// create-theater.dto.ts
import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateTheaterDto {
  @IsString()
  @IsNotEmpty() // Ensures name is not empty or null
  name: string;

  @IsInt()
  @IsNotEmpty() // Ensures seatsAmount is not empty or null
  seatsAmount: number;
}
