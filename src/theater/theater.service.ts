/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Theater } from './entities/theater.entity';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';

@Injectable()
export class TheatersService {
  constructor(
    @InjectRepository(Theater)
    private readonly theaterRepository: Repository<Theater>,
  ) {}

  async create(dto: CreateTheaterDto): Promise<Theater> {
    const theater = this.theaterRepository.create(dto);
    theater.initializeSeats();
    return await this.theaterRepository.save(theater);
  }

  async findAll(): Promise<Theater[]> {
    return await this.theaterRepository.find();
  }

  async updateByName(name: string, dto: UpdateTheaterDto): Promise<Theater> {
    const theater = await this.theaterRepository.findOne({
      where: { name: ILike(name) },
    });

    if (!theater) {
      throw new NotFoundException(`Theater with name "${name}" not found`);
    }

    Object.assign(theater, dto);
    return await this.theaterRepository.save(theater);
  }

  async removeByName(name: string): Promise<{ message: string }> {
    const theater = await this.theaterRepository.findOne({
      where: { name: ILike(name) },
    });

    if (!theater) {
      throw new NotFoundException(`Theater with name "${name}" not found`);
    }

    await this.theaterRepository.remove(theater);
    return { message: `Theater "${name}" has been deleted successfully` };
  }
}
