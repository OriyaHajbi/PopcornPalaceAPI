/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

describe('MoviesService', () => {
  let service: MoviesService;
  let repo: Repository<Movie>;

  const mockMovie: Movie = {
    id: 1,
    title: 'Inception',
    genre: 'Sci-Fi',
    duration: 120,
    rating: 9,
    releaseYear: 2010,
    showtimes: [],
  };

  const mockMovieRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockMovieRepo,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    repo = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      mockMovieRepo.findOne.mockResolvedValue(null);
      mockMovieRepo.create.mockReturnValue(mockMovie);
      mockMovieRepo.save.mockResolvedValue(mockMovie);

      const dto: CreateMovieDto = {
        title: 'Inception',
        genre: 'Sci-Fi',
        duration: 120,
        rating: 9,
        releaseYear: 2010,
      };

      const result = await service.create(dto);
      expect(result).toEqual(mockMovie);
      expect(repo.save).toHaveBeenCalledWith(mockMovie);
    });

    it('should throw conflict if title exists', async () => {
      mockMovieRepo.findOne.mockResolvedValue(mockMovie);

      const dto: CreateMovieDto = {
        title: 'Inception',
        genre: 'Sci-Fi',
        duration: 120,
        rating: 9,
        releaseYear: 2010,
      };

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all movies', async () => {
      mockMovieRepo.find.mockResolvedValue([mockMovie]);
      const result = await service.findAll();
      expect(result).toEqual([mockMovie]);
    });
  });

  describe('findOne', () => {
    it('should return a movie by id', async () => {
      mockMovieRepo.findOne.mockResolvedValue(mockMovie);
      const result = await service.findOne(1);
      expect(result).toEqual(mockMovie);
    });

    it('should throw if not found', async () => {
      mockMovieRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(2)).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeByTitle', () => {
    it('should remove movie by title', async () => {
      mockMovieRepo.findOne.mockResolvedValue(mockMovie);
      await service.removeByTitle('Inception');
      expect(repo.remove).toHaveBeenCalledWith(mockMovie);
    });

    it('should throw if not found', async () => {
      mockMovieRepo.findOne.mockResolvedValue(null);
      await expect(service.removeByTitle('Unknown')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateByTitle', () => {
    it('should update a movie by title', async () => {
      const updatedDto: UpdateMovieDto = { rating: 8 };
      mockMovieRepo.findOne.mockResolvedValue(mockMovie);
      mockMovieRepo.save.mockResolvedValue({ ...mockMovie, ...updatedDto });

      await service.updateByTitle('Inception', updatedDto);
      expect(repo.save).toHaveBeenCalledWith(
        expect.objectContaining({ rating: 8 }),
      );
    });

    it('should throw if movie not found', async () => {
      mockMovieRepo.findOne.mockResolvedValue(null);
      await expect(
        service.updateByTitle('Unknown', { rating: 5 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove movie by id', async () => {
      mockMovieRepo.findOne.mockResolvedValue(mockMovie);
      await service.remove(1);
      expect(repo.remove).toHaveBeenCalledWith(mockMovie);
    });

    it('should throw if not found by id', async () => {
      mockMovieRepo.findOne.mockResolvedValue(null);
      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
