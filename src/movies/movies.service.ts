/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(_createMovieDto: CreateMovieDto) {
    // console.log('Create Movie DTO:', _createMovieDto);

    const movie = this.moviesRepository.create(_createMovieDto);
    return await this.moviesRepository.save(movie);
  }

  async findAll() {
    return await this.moviesRepository.find();
  }

  async findOne(id: number) {
    const movie = await this.moviesRepository.findOne({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return movie;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(id: number, _updateMovieDto: UpdateMovieDto) {
    const movie = await this.findOne(id);
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    Object.assign(movie, _updateMovieDto);
    return await this.moviesRepository.save(movie);
  }

  async remove(id: number) {
    const movie = await this.findOne(id);
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return await this.moviesRepository.remove(movie);
  }
}
