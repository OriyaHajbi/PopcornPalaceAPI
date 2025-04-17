/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { User } from '../user/entities/user.entity';
import { Showtime } from '../showtimes/entities/showtime.entity';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';

describe('BookingService', () => {
  let service: BookingService;
  let bookingRepo: Repository<Booking>;
  let userRepo: Repository<User>;
  let showtimeRepo: Repository<Showtime>;

  const mockUser = { id: 'user-uuid' } as User;
  const mockShowtime = {
    id: 1,
    seats: [
      { seatNumber: 1, isBooked: false, bookedBy: null },
      { seatNumber: 2, isBooked: true, bookedBy: 'other-user' },
    ],
  } as Showtime;

  const mockBookingRepo = {
    create: jest.fn().mockImplementation((data) => data),
    save: jest.fn().mockImplementation((booking) => ({
      ...booking,
      id: 'booking-uuid',
      bookedAt: new Date(),
    })),
    findOne: jest.fn(),
  };

  const mockUserRepo = {
    findOne: jest.fn(),
  };

  const mockShowtimeRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        { provide: getRepositoryToken(Booking), useValue: mockBookingRepo },
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: getRepositoryToken(Showtime), useValue: mockShowtimeRepo },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    bookingRepo = module.get(getRepositoryToken(Booking));
    userRepo = module.get(getRepositoryToken(User));
    showtimeRepo = module.get(getRepositoryToken(Showtime));

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new booking successfully', async () => {
      const dto: CreateBookingDto = {
        showtimeId: 1,
        seatNumber: 1,
        userId: 'user-uuid',
      };

      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockShowtimeRepo.findOne.mockResolvedValue({ ...mockShowtime });
      mockBookingRepo.findOne.mockResolvedValue(null);

      const result = await service.create(dto);

      expect(result).toEqual({ bookingId: 'booking-uuid' });
      expect(mockShowtimeRepo.save).toHaveBeenCalled();
      expect(mockBookingRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);

      await expect(
        service.create({
          showtimeId: 1,
          seatNumber: 1,
          userId: 'missing-user',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if showtime not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockShowtimeRepo.findOne.mockResolvedValue(null);

      await expect(
        service.create({
          showtimeId: 999,
          seatNumber: 1,
          userId: 'user-uuid',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid seat number', async () => {
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockShowtimeRepo.findOne.mockResolvedValue({ ...mockShowtime });

      await expect(
        service.create({
          showtimeId: 1,
          seatNumber: 99,
          userId: 'user-uuid',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if seat already booked', async () => {
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockShowtimeRepo.findOne.mockResolvedValue({ ...mockShowtime });

      await expect(
        service.create({
          showtimeId: 1,
          seatNumber: 2,
          userId: 'user-uuid',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
