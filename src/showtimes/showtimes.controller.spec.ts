/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';

describe('ShowtimesController', () => {
  let controller: ShowtimesController;
  let service: ShowtimesService;

  const mockShowtime = {
    id: 1,
    movieId: 1,
    price: 50,
    startTime: new Date(),
    endTime: new Date(),
    theater: { name: 'Cinema City' },
  };

  const mockService = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowtimesController],
      providers: [
        {
          provide: ShowtimesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ShowtimesController>(ShowtimesController);
    service = module.get<ShowtimesService>(ShowtimesService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should call service.create and return result', async () => {
      const dto: CreateShowtimeDto = {
        movieId: 1,
        theaterId: 2,
        startTime: new Date(),
        endTime: new Date(),
        price: 25,
      };

      const expectedResult = { id: 1, ...dto };

      mockService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a showtime by id', async () => {
      mockService.findOne.mockResolvedValue(mockShowtime);
      const result = await controller.findOne('1');
      expect(result).toEqual(mockShowtime);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('updateShowtime', () => {
    it('should call service.update with correct args', async () => {
      const updateDto: UpdateShowtimeDto = {
        price: 60,
        startTime: new Date(),
        endTime: new Date(),
      };

      const updatedResult = { ...mockShowtime, ...updateDto };
      mockService.update.mockResolvedValue(updatedResult);

      const result = await controller.updateShowtime(1, updateDto);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(updatedResult);
    });
  });

  describe('remove', () => {
    it('should call service.remove with correct id', async () => {
      mockService.remove.mockResolvedValue({ message: 'Deleted' });
      const result = await controller.remove('1');
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: 'Deleted' });
    });
  });
});
