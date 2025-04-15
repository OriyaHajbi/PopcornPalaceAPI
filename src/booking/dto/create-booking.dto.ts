/* eslint-disable prettier/prettier */
import { IsInt, IsNotEmpty, IsPositive, IsUUID } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  showtimeId: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  seatNumber: number;
}
