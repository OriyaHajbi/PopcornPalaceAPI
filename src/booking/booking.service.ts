/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Showtime } from 'src/showtimes/entities/showtime.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    const { showtimeId, seatNumber, userId } = createBookingDto;

    // Step 1: Find the user
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Step 2: Find the showtime with seats
    const showtime = await this.showtimeRepository.findOne({
      where: { id: showtimeId },
    });
    if (!showtime) {
      throw new NotFoundException('Showtime not found');
    }

    if (!showtime.seats || showtime.seats.length === 0) {
      throw new NotFoundException('Showtime has no available seats');
    }

    // Step 3: Check if seat is already booked in showtime.seats
    const seatIndex = showtime.seats.findIndex(
      (seat) => seat.seatNumber === seatNumber,
    );
    if (seatIndex === -1) {
      throw new BadRequestException(
        `Seat number ${seatNumber} not found in this showtime`,
      );
    }

    if (showtime.seats[seatIndex].isBooked) {
      throw new ConflictException('Seat already booked');
    }

    // Step 4: Mark seat as booked
    showtime.seats[seatIndex].isBooked = true;
    showtime.seats[seatIndex].bookedBy = user.id;

    await this.showtimeRepository.save(showtime); // save the updated seats

    // Step 5: Save the booking
    const booking = this.bookingRepository.create({
      user,
      showtime,
      seatNumber,
    });

    const saved = await this.bookingRepository.save(booking);

    return {
      bookingId: saved.id,
    };
  }
}
