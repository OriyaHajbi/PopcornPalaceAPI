/* eslint-disable prettier/prettier */
// /* eslint-disable prettier/prettier */
// import { Test, TestingModule } from '@nestjs/testing';
// import { ShowtimesService } from './showtimes.service';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { Movie } from 'src/movies/entities/movie.entity';
// import { Showtime } from './entities/showtime.entity';
// import { Theater } from 'src/theater/entities/theater.entity';
// import { ConflictException, NotFoundException } from '@nestjs/common';
// import { Repository } from 'typeorm';

// // Mocked repository functions
// const mockMovieRepository = () => ({
//   create: jest.fn(),
//   findOne: jest.fn(),
//   save: jest.fn(),
// });

// const mockShowtimeRepository = () => ({
//   create: jest.fn(),
//   findOne: jest.fn(),
//   save: jest.fn(),
//   remove: jest.fn(),
// });

// const mockTheaterRepository = () => ({
//   findOne: jest.fn(),
// });

// describe('ShowtimesService', () => {
//   let service: ShowtimesService;
//   let movieRepo: jest.Mocked<Repository<Movie>>;
//   let showtimeRepo: jest.Mocked<Repository<Showtime>>;
//   let theaterRepo: jest.Mocked<Repository<Theater>>;

//   beforeEach(async () => {
//     jest.clearAllMocks();

//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         ShowtimesService,
//         {
//           provide: getRepositoryToken(Movie),
//           useFactory: mockMovieRepository,
//         },
//         {
//           provide: getRepositoryToken(Showtime),
//           useFactory: mockShowtimeRepository,
//         },
//         {
//           provide: getRepositoryToken(Theater),
//           useFactory: mockTheaterRepository,
//         },
//       ],
//     }).compile();

//     service = module.get<ShowtimesService>(ShowtimesService);
//     movieRepo = module.get(getRepositoryToken(Movie));
//     showtimeRepo = module.get(getRepositoryToken(Showtime));
//     theaterRepo = module.get(getRepositoryToken(Theater));
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('create', () => {
//     it('should create a new showtime', async () => {
//       const dto = {
//         movieId: 1,
//         theaterId: 1,
//         startTime: new Date('2025-04-20T18:00:00'),
//         endTime: new Date('2025-04-20T20:00:00'),
//         price: 15,
//       };

//       // Complete movie object with required properties
//       const movie: Movie = {
//         id: 1,
//         title: 'Movie Title',
//         genre: 'Action',
//         duration: 120,
//         rating: 8.5,
//         releaseYear: 2020,
//       };

//       const theater: Theater = {
//         id: 1,
//         name: 'Theater Name',
//         seatsAmount: 100,
//       };
//       const showtime = {
//         id: 1,
//         movie,
//         theater,
//         startTime: dto.startTime,
//         endTime: dto.endTime,
//         price: dto.price,
//       };

//       movieRepo.findOne.mockResolvedValueOnce(movie);
//       theaterRepo.findOne.mockResolvedValueOnce(theater);
//       showtimeRepo.findOne.mockResolvedValueOnce(null); // No overlapping showtime
//       showtimeRepo.create.mockReturnValueOnce(showtime);
//       showtimeRepo.save.mockResolvedValueOnce(showtime);

//       const result = await service.create(dto);

//       expect(result).toEqual({
//         id: 1,
//         price: 15,
//         movieId: 1,
//         theater: 'Theater Name',
//         startTime: expect.any(Date),
//         endTime: expect.any(Date),
//       });
//     });

//     it('should throw NotFoundException if movie not found', async () => {
//       const dto = {
//         movieId: 1,
//         theaterId: 1,
//         startTime: new Date(),
//         endTime: new Date(),
//         price: 15,
//       };

//       movieRepo.findOne.mockResolvedValueOnce(null);

//       await expect(service.create(dto)).rejects.toThrow(NotFoundException);
//     });

//     it('should throw ConflictException if overlapping showtime exists', async () => {
//       const dto = {
//         movieId: 1,
//         theaterId: 1,
//         startTime: new Date('2025-04-20T18:00:00'),
//         endTime: new Date('2025-04-20T20:00:00'),
//         price: 15,
//       };

//       const movie: Movie = {
//         id: 1,
//         title: 'Movie Title',
//         genre: 'Action',
//         duration: 120,
//         rating: 8.5,
//         releaseDate: new Date('2023-04-15'),
//       };

//       const theater: Theater = {
//         id: 1,
//         name: 'Theater Name',
//         seatsAmount: 100,
//       };

//       movieRepo.findOne.mockResolvedValueOnce(movie);
//       theaterRepo.findOne.mockResolvedValueOnce(theater);
//       showtimeRepo.findOne.mockResolvedValueOnce({ id: 2 }); // Overlapping showtime

//       await expect(service.create(dto)).rejects.toThrow(ConflictException);
//     });
//   });

//   describe('findOne', () => {
//     it('should return showtime by id', async () => {
//       const showtime = {
//         id: 1,
//         movie: { id: 1, title: 'Movie Title' },
//         theater: { name: 'Theater Name' },
//         startTime: new Date(),
//         endTime: new Date(),
//         price: 15,
//       };

//       showtimeRepo.findOne.mockResolvedValueOnce(showtime);
//       const result = await service.findOne(1);
//       expect(result).toEqual(showtime);
//     });

//     it('should throw NotFoundException if not found', async () => {
//       showtimeRepo.findOne.mockResolvedValueOnce(null);
//       await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
//     });
//   });

//   describe('update', () => {
//     it('should update a showtime', async () => {
//       const updateDto = { price: 20 };
//       const showtime = {
//         id: 1,
//         movie: { id: 1, title: 'Movie Title' },
//         theater: { name: 'Theater Name' },
//         startTime: new Date(),
//         endTime: new Date(),
//         price: 15,
//       };

//       showtimeRepo.findOne.mockResolvedValueOnce(showtime);
//       showtimeRepo.save.mockResolvedValueOnce({ ...showtime, ...updateDto });

//       await service.update(1, updateDto);

//       expect(showtimeRepo.save).toHaveBeenCalledWith({
//         ...showtime,
//         ...updateDto,
//       });
//     });

//     it('should throw NotFoundException if showtime not found for update', async () => {
//       showtimeRepo.findOne.mockResolvedValueOnce(null);
//       await expect(service.update(1, { price: 20 })).rejects.toThrow(
//         NotFoundException,
//       );
//     });
//   });

//   describe('remove', () => {
//     it('should remove a showtime', async () => {
//       const showtime = {
//         id: 1,
//         movie: { id: 1, title: 'Movie Title' },
//         theater: { name: 'Theater Name' },
//         startTime: new Date(),
//         endTime: new Date(),
//         price: 15,
//         tickets: [], // ← Added
//         seats: [], // ← Added
//         initializeSeatsFromTheater: jest.fn(), // ← Added
//       };

//       showtimeRepo.findOne.mockResolvedValueOnce(showtime);
//       showtimeRepo.remove.mockResolvedValueOnce(undefined);

//       const result = await service.remove(1);
//       expect(result).toBeUndefined();
//       expect(showtimeRepo.remove).toHaveBeenCalledWith(showtime);
//     });

//     it('should throw NotFoundException if showtime not found for removal', async () => {
//       showtimeRepo.findOne.mockResolvedValueOnce(null);
//       await expect(service.remove(1)).rejects.toThrow(NotFoundException);
//     });
//   });
// });
/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesService } from './showtimes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from 'src/movies/entities/movie.entity';
import { Showtime } from './entities/showtime.entity';
import { Theater } from 'src/theater/entities/theater.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

const mockMovieRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn((movie) => movie),
});

const mockShowtimeRepository = () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

const mockTheaterRepository = () => ({
  findOne: jest.fn(),
});

describe('ShowtimesService', () => {
  let service: ShowtimesService;
  let movieRepo: jest.Mocked<Repository<Movie>>;
  let showtimeRepo: jest.Mocked<Repository<Showtime>>;
  let theaterRepo: jest.Mocked<Repository<Theater>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowtimesService,
        {
          provide: getRepositoryToken(Movie),
          useFactory: mockMovieRepository,
        },
        {
          provide: getRepositoryToken(Showtime),
          useFactory: mockShowtimeRepository,
        },
        {
          provide: getRepositoryToken(Theater),
          useFactory: mockTheaterRepository,
        },
      ],
    }).compile();

    service = module.get<ShowtimesService>(ShowtimesService);
    movieRepo = module.get(getRepositoryToken(Movie));
    showtimeRepo = module.get(getRepositoryToken(Showtime));
    theaterRepo = module.get(getRepositoryToken(Theater));
  });

  describe('create', () => {
    it('should create a new showtime', async () => {
      const dto = {
        movieId: 1,
        theaterId: 1,
        startTime: new Date('2025-04-20T18:00:00'),
        endTime: new Date('2025-04-20T20:00:00'),
        price: 15,
      };

      const movie: Movie = {
        id: 1,
        title: 'Movie Title',
        genre: 'Action',
        duration: 120,
        rating: 8.5,
        releaseYear: 2023,
        showtimes: [],
      };

      const theater: Theater = {
        id: 1,
        name: 'Theater Name',
        seatsAmount: 100,
        showtimes: [],
      };

      const showtime: Showtime = {
        id: 1,
        movie,
        theater,
        startTime: dto.startTime,
        endTime: dto.endTime,
        price: dto.price,
        tickets: [],
        seats: [],
        initializeSeatsFromTheater: jest.fn(),
      };

      movieRepo.findOne.mockResolvedValueOnce(movie);
      theaterRepo.findOne.mockResolvedValueOnce(theater);
      showtimeRepo.findOne.mockResolvedValueOnce(null);
      showtimeRepo.create.mockReturnValueOnce(showtime);
      showtimeRepo.save.mockResolvedValueOnce(showtime);

      const result = await service.create(dto);

      expect(result).toEqual({
        id: 1,
        price: 15,
        movieId: 1,
        theater: 'Theater Name',
        startTime: expect.any(Date),
        endTime: expect.any(Date),
      });
    });

    it('should throw NotFoundException if movie or theater is missing', async () => {
      const dto = {
        movieId: 1,
        theaterId: 1,
        startTime: new Date(),
        endTime: new Date(),
        price: 15,
      };

      movieRepo.findOne.mockResolvedValueOnce(null); // Missing movie
      theaterRepo.findOne.mockResolvedValueOnce(null); // Missing theater

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if overlapping showtime exists', async () => {
      const dto = {
        movieId: 1,
        theaterId: 1,
        startTime: new Date('2025-04-20T18:00:00'),
        endTime: new Date('2025-04-20T20:00:00'),
        price: 15,
      };

      const movie: Movie = {
        id: 1,
        title: 'Movie Title',
        genre: 'Action',
        duration: 120,
        rating: 8.5,
        releaseYear: 2023,
        showtimes: [],
      };

      const theater: Theater = {
        id: 1,
        name: 'Theater Name',
        seatsAmount: 100,
        showtimes: [],
      };

      movieRepo.findOne.mockResolvedValueOnce(movie);
      theaterRepo.findOne.mockResolvedValueOnce(theater);
      showtimeRepo.findOne.mockResolvedValueOnce({
        id: 99,
        startTime: new Date('2025-04-20T18:30:00'),
        endTime: new Date('2025-04-20T19:30:00'),
      } as Showtime);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return showtime by id', async () => {
      const showtime: Showtime = {
        id: 1,
        movie: {
          id: 1,
          title: 'Movie Title',
          genre: 'Action',
          duration: 120,
          rating: 8.5,
          releaseYear: 2023,
          showtimes: [],
        },
        theater: {
          id: 1,
          name: 'Theater Name',
          seatsAmount: 100,
          showtimes: [],
        },
        startTime: new Date(),
        endTime: new Date(),
        price: 15,
        tickets: [],
        seats: [],
        initializeSeatsFromTheater: jest.fn(),
      };

      showtimeRepo.findOne.mockResolvedValueOnce(showtime);
      const result = await service.findOne(1);
      expect(result).toEqual(showtime);
    });

    it('should throw NotFoundException if showtime not found', async () => {
      showtimeRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a showtime', async () => {
      const updateDto = { price: 20 };

      const showtime: Showtime = {
        id: 1,
        movie: {
          id: 1,
          title: 'Movie Title',
          genre: 'Action',
          duration: 120,
          rating: 8.5,
          releaseYear: 2023,
          showtimes: [],
        },
        theater: {
          id: 1,
          name: 'Theater Name',
          seatsAmount: 100,
          showtimes: [],
        },
        startTime: new Date(),
        endTime: new Date(),
        price: 15,
        tickets: [],
        seats: [],
        initializeSeatsFromTheater: jest.fn(),
      };

      showtimeRepo.findOne.mockResolvedValueOnce(showtime);
      showtimeRepo.save.mockResolvedValueOnce({
        ...showtime,
        ...updateDto,
        tickets: showtime.tickets ?? [],
        seats: showtime.seats ?? [],
        initializeSeatsFromTheater:
          showtime.initializeSeatsFromTheater ?? jest.fn(),
      });
      await service.update(1, updateDto);
      expect(showtimeRepo.save).toHaveBeenCalledWith({
        ...showtime,
        ...updateDto,
      });
    });

    it('should throw NotFoundException if showtime not found for update', async () => {
      showtimeRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.update(1, { price: 20 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a showtime', async () => {
      const showtime: Showtime = {
        id: 1,
        movie: {
          id: 1,
          title: 'Movie Title',
          genre: 'Action',
          duration: 120,
          rating: 8.5,
          releaseYear: 2023,
          showtimes: [],
        },
        theater: {
          id: 1,
          name: 'Theater Name',
          seatsAmount: 100,
          showtimes: [],
        },
        startTime: new Date(),
        endTime: new Date(),
        price: 15,
        tickets: [],
        seats: [],
        initializeSeatsFromTheater: jest.fn(),
      };

      showtimeRepo.findOne.mockResolvedValueOnce(showtime);
      showtimeRepo.remove.mockResolvedValueOnce(undefined);

      const result = await service.remove(1);
      expect(result).toBeUndefined();
      expect(showtimeRepo.remove).toHaveBeenCalledWith(showtime);
    });

    it('should throw NotFoundException if showtime not found for removal', async () => {
      showtimeRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
