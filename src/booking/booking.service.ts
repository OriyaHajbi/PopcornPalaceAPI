/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
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

  // Create a new Booking
  async create(createBookingDto: CreateBookingDto) {
    const { showtimeId, seatNumber, userId } = createBookingDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const showtime = await this.showtimeRepository.findOne({
      where: { id: showtimeId },
    });
    if (!showtime) {
      throw new NotFoundException('Showtime not found');
    }

    // Ensure the seat is not already booked
    const existingbooking = await this.bookingRepository.findOne({
      where: { showtime: { id: showtimeId }, seatNumber },
    });

    if (existingbooking) {
      throw new Error('Seat already booked');
    }

    const booking = this.bookingRepository.create({
      ...createBookingDto,
      user,
      showtime,
    });

    const saved = await this.bookingRepository.save(booking);
    return {
      bookingId: saved.id,
    };
  }

  // Find all bookings
  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find({
      relations: ['user', 'showtime'],
    });
  }

  // Find booking by ID
  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['user', 'showtime'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  // Update booking (for example, mark as booked)
  async update(id: string, updateData: Partial<Booking>): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({ where: { id } });

    if (!booking) {
      throw new NotFoundException('booking not found');
    }

    Object.assign(booking, updateData);

    return this.bookingRepository.save(booking);
  }

  // Remove booking
  async remove(id: string): Promise<void> {
    const booking = await this.bookingRepository.findOne({ where: { id } });

    if (!booking) {
      throw new NotFoundException('booking not found');
    }

    await this.bookingRepository.remove(booking);
  }
}
