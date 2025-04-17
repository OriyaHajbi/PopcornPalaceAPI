/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { TheatersService } from './theater.service';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';
import { NotFoundException } from '@nestjs/common';
import { TheatersController } from './theater.controller';

// Mocking TheatersService to simulate database operations
const mockTheatersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  updateByName: jest.fn(),
  removeByName: jest.fn(),
};

describe('TheatersController', () => {
  let controller: TheatersController;
  let service: TheatersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TheatersController],
      providers: [
        {
          provide: TheatersService,
          useValue: mockTheatersService,
        },
      ],
    }).compile();

    controller = module.get<TheatersController>(TheatersController);
    service = module.get<TheatersService>(TheatersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new theater and return it', async () => {
      const createTheaterDto: CreateTheaterDto = {
        name: 'Theater A',
        seatsAmount: 150,
      };

      const result = { id: 1, ...createTheaterDto };

      mockTheatersService.create.mockResolvedValue(result);

      expect(await controller.create(createTheaterDto)).toEqual(result);
      expect(mockTheatersService.create).toHaveBeenCalledWith(createTheaterDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of theaters', async () => {
      const result = [
        { id: 1, name: 'Theater A', seatsAmount: 150 },
        { id: 2, name: 'Theater B', seatsAmount: 200 },
      ];

      mockTheatersService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(mockTheatersService.findAll).toHaveBeenCalled();
    });
  });

  describe('updateByName', () => {
    it('should update a theater by name and return it', async () => {
      const name = 'Theater A';
      const updateTheaterDto: UpdateTheaterDto = {
        name: 'Updated Theater A',
        seatsAmount: 180,
      };

      const result = { id: 1, ...updateTheaterDto };

      mockTheatersService.updateByName.mockResolvedValue(result);

      expect(await controller.updateByName(name, updateTheaterDto)).toEqual(
        result,
      );
      expect(mockTheatersService.updateByName).toHaveBeenCalledWith(
        name,
        updateTheaterDto,
      );
    });

    it('should throw NotFoundException if theater does not exist', async () => {
      const name = 'Non-existent Theater';
      const updateTheaterDto: UpdateTheaterDto = {
        name: 'Updated Theater',
        seatsAmount: 180,
      };

      mockTheatersService.updateByName.mockRejectedValue(
        new NotFoundException('Theater not found'),
      );

      try {
        await controller.updateByName(name, updateTheaterDto);
      } catch (e) {
        expect(e.response.message).toBe('Theater not found');
      }
    });
  });

  describe('removeByName', () => {
    it('should remove a theater by name', async () => {
      const name = 'Theater A';

      mockTheatersService.removeByName.mockResolvedValue({});

      expect(await controller.removeByName(name)).toEqual({});
      expect(mockTheatersService.removeByName).toHaveBeenCalledWith(name);
    });

    it('should throw NotFoundException if theater does not exist', async () => {
      const name = 'Non-existent Theater';

      mockTheatersService.removeByName.mockRejectedValue(
        new NotFoundException('Theater not found'),
      );

      try {
        await controller.removeByName(name);
      } catch (e) {
        expect(e.response.message).toBe('Theater not found');
      }
    });
  });
});
