/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from './entities/booking.entity';
import { Showtime } from 'src/showtimes/entities/showtime.entity';
import { Theater } from 'src/theater/entities/theater.entity';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [BookingController],
  providers: [BookingService],
  imports: [TypeOrmModule.forFeature([Booking, Showtime, Theater]), UserModule],
})
export class BookingModule {}
