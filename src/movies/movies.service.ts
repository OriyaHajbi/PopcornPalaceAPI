/* eslint-disable prettier/prettier */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
  ) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(_createMovieDto: CreateMovieDto) {
    // console.log('Create Movie DTO:', _createMovieDto);
    const existing = await this.moviesRepository.findOne({
      where: { title: _createMovieDto.title },
    });

    if (existing) {
      throw new ConflictException(
        `Movie with title "${_createMovieDto.title}" already exists.`,
      );
    }
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

  async removeByTitle(title: string): Promise<{ message: string }> {
    console.log(title);

    const movie = await this.moviesRepository.findOne({
      where: { title: ILike(title) }, // case-insensitive search
    });

    if (!movie) {
      throw new NotFoundException(`Movie with title "${title}" not found`);
    }

    await this.moviesRepository.remove(movie);

    return { message: `Movie "${movie.title}" has been deleted.` };
  }

  async updateByTitle(
    title: string,
    updateDto: UpdateMovieDto,
  ): Promise<Movie> {
    const cleanTitle = title.trim().toLowerCase();
    console.log(cleanTitle);
    console.log(updateDto);

    const movie = await this.moviesRepository.findOne({
      where: { title: ILike(cleanTitle) },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with title "${title}" not found`);
    }

    Object.assign(movie, updateDto);
    return await this.moviesRepository.save(movie);
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
