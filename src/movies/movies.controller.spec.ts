/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  const mockMoviesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    updateByTitle: jest.fn(),
    removeByTitle: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call create on the service and return the result', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'Inception',
        genre: 'Sci-Fi',
        duration: 148,
        rating: 9,
        releaseYear: 2010,
      };
      const result = { id: 1, ...createMovieDto };

      mockMoviesService.create.mockResolvedValue(result);

      expect(await controller.create(createMovieDto)).toEqual(result);
      expect(mockMoviesService.create).toHaveBeenCalledWith(createMovieDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const result = [
        {
          id: 1,
          title: 'Inception',
          genre: 'Sci-Fi',
          duration: 148,
          rating: 9,
          releaseYear: 2010,
        },
        {
          id: 2,
          title: 'The Dark Knight',
          genre: 'Action',
          duration: 152,
          rating: 9.0,
          releaseYear: 2008,
        },
      ];

      mockMoviesService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(mockMoviesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a movie by id', async () => {
      const result = {
        id: 1,
        title: 'Inception',
        genre: 'Sci-Fi',
        duration: 148,
        rating: 9,
        releaseYear: 2010,
      };

      mockMoviesService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toEqual(result);
      expect(mockMoviesService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('updateByTitle', () => {
    it('should call updateByTitle on the service and return the result', async () => {
      const updateMovieDto: UpdateMovieDto = { genre: 'Action' };
      const result = {
        id: 1,
        title: 'Inception',
        genre: 'Action',
        duration: 148,
        rating: 9,
        releaseYear: 2010,
      };

      mockMoviesService.updateByTitle.mockResolvedValue(result);

      expect(
        await controller.updateByTitle('Inception', updateMovieDto),
      ).toEqual(result);
      expect(mockMoviesService.updateByTitle).toHaveBeenCalledWith(
        'Inception',
        updateMovieDto,
      );
    });
  });

  describe('removeByTitle', () => {
    it('should call removeByTitle on the service and return the result', async () => {
      const result = {
        message: 'Movie "Inception" has been deleted successfully',
      };

      mockMoviesService.removeByTitle.mockResolvedValue(result);

      expect(await controller.removeByTitle('Inception')).toEqual(result);
      expect(mockMoviesService.removeByTitle).toHaveBeenCalledWith('Inception');
    });
  });
});
