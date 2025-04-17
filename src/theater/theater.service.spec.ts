/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { TheatersService } from './theater.service';
import { Theater } from './entities/theater.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';

// Mocking the Theater entity repository
const mockTheaterRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

describe('TheatersService', () => {
  let service: TheatersService;
  let repository: Repository<Theater>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TheatersService,
        {
          provide: getRepositoryToken(Theater),
          useValue: mockTheaterRepository,
        },
      ],
    }).compile();

    service = module.get<TheatersService>(TheatersService);
    repository = module.get<Repository<Theater>>(getRepositoryToken(Theater));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save a new theater', async () => {
      const createTheaterDto: CreateTheaterDto = {
        name: 'Theater A',
        seatsAmount: 150,
      };

      const result = { id: 1, ...createTheaterDto };

      mockTheaterRepository.create.mockReturnValue(result);
      mockTheaterRepository.save.mockResolvedValue(result);

      expect(await service.create(createTheaterDto)).toEqual(result);
      expect(mockTheaterRepository.create).toHaveBeenCalledWith(
        createTheaterDto,
      );
      expect(mockTheaterRepository.save).toHaveBeenCalledWith(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of theaters', async () => {
      const result = [
        { id: 1, name: 'Theater A', seatsAmount: 150 },
        { id: 2, name: 'Theater B', seatsAmount: 200 },
      ];

      mockTheaterRepository.find.mockResolvedValue(result);

      expect(await service.findAll()).toEqual(result);
      expect(mockTheaterRepository.find).toHaveBeenCalled();
    });
  });

  describe('updateByName', () => {
    it('should update a theater by name and return the updated theater', async () => {
      const name = 'Theater A';
      const updateTheaterDto: UpdateTheaterDto = {
        name: 'Updated Theater A',
        seatsAmount: 180,
      };

      const result = { id: 1, ...updateTheaterDto };

      // Mocking the findOne method to return a theater with the expected name
      mockTheaterRepository.findOne.mockResolvedValueOnce({
        id: 1,
        name: 'Theater A',
        seatsAmount: 150,
      });
      mockTheaterRepository.save.mockResolvedValueOnce(result);

      // Expect findOne to be called with the correct where clause
      await expect(
        service.updateByName(name, updateTheaterDto),
      ).resolves.toEqual(result);

      // Expect the findOne to use FindOperator with ilike
      expect(mockTheaterRepository.findOne).toHaveBeenCalledWith({
        where: {
          name: expect.objectContaining({
            _type: 'ilike', // Expecting the FindOperator to be used for the `name` field
            _value: 'Theater A', // The value being passed to the FindOperator
          }),
        },
      });

      expect(mockTheaterRepository.save).toHaveBeenCalledWith({
        id: 1,
        name: 'Updated Theater A',
        seatsAmount: 180,
      });
    });

    it('should throw NotFoundException if theater does not exist', async () => {
      const name = 'Non-existent Theater';
      const updateTheaterDto: UpdateTheaterDto = {
        name: 'Updated Theater',
        seatsAmount: 180,
      };

      mockTheaterRepository.findOne.mockResolvedValue(null);

      try {
        await service.updateByName(name, updateTheaterDto);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.response.message).toBe(
          `Theater with name "${name}" not found`,
        );
      }
    });
  });

  describe('removeByName', () => {
    it('should remove a theater by name', async () => {
      const name = 'Theater A';
      const result = {
        message: `Theater "${name}" has been deleted successfully`,
      };

      // Mocking the findOne method to return a theater with the expected name
      mockTheaterRepository.findOne.mockResolvedValueOnce({
        id: 1,
        name: 'Theater A',
        seatsAmount: 150,
      });
      mockTheaterRepository.remove.mockResolvedValueOnce(result);

      // Expect the method to return the correct result
      await expect(service.removeByName(name)).resolves.toEqual(result);

      // Expect findOne to use FindOperator with ilike for the name
      expect(mockTheaterRepository.findOne).toHaveBeenCalledWith({
        where: {
          name: expect.objectContaining({
            _type: 'ilike', // Expecting FindOperator with ilike
            _value: 'Theater A', // The value being passed to the operator
          }),
        },
      });

      expect(mockTheaterRepository.remove).toHaveBeenCalledWith({
        id: 1,
        name: 'Theater A',
        seatsAmount: 150,
      });
    });

    it('should throw NotFoundException if theater does not exist', async () => {
      const name = 'Non-existent Theater';

      mockTheaterRepository.findOne.mockResolvedValue(null);

      try {
        await service.removeByName(name);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.response.message).toBe(
          `Theater with name "${name}" not found`,
        );
      }
    });
  });
});
