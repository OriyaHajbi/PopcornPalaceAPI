/* eslint-disable prettier/prettier */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { Showtime } from './entities/showtime.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from 'src/movies/entities/movie.entity';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimesRepository: Repository<Showtime>,
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
  ) {}

  async create(createShowtimeDto: CreateShowtimeDto) {
    const { movieId, theater, startTime, endTime, price } = createShowtimeDto;
    const movie = await this.moviesRepository.findOne({
      where: { id: movieId },
    });

    console.log(movie);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    // need to add logic
    // Check for overlapping showtimes
    const overlappingShowtime = await this.showtimesRepository.findOne({
      where: {
        theater,
        movie,
        startTime: MoreThan(endTime),
        endTime: LessThan(startTime),
      },
    });
    console.log(overlappingShowtime);

    if (overlappingShowtime) {
      throw new ConflictException('There is an overlapping showtime');
    }
    console.log('After Overlapping');

    const showtime = this.showtimesRepository.create({
      movie, // Movie entity, not just the movieId
      theater,
      startTime,
      endTime,
      price,
    });
    return await this.showtimesRepository.save(showtime);
  }

  async findAll() {
    return await this.showtimesRepository.find();
  }

  async findOne(id: number) {
    const showtime = await this.showtimesRepository.findOne({
      where: { id },
    });

    if (!showtime) {
      throw new NotFoundException(`Showtime with ${id} not found`);
    }
    return showtime;
  }

  // async update(id: number, updateShowtimeDto: UpdateShowtimeDto) {
  //   const showtime = await this.findOne(id);

  //   if (!showtime) {
  //     throw new NotFoundException(`Showtime with ${id} not found`);
  //   }
  //   Object.assign(showtime, updateShowtimeDto);
  //   return await this.showtimesRepository.save(showtime);
  // }
  async update(id: number, updateDto: UpdateShowtimeDto): Promise<Showtime> {
    const showtime = await this.showtimesRepository.findOne({ where: { id } });

    if (!showtime) {
      throw new NotFoundException(`Showtime with ID ${id} not found`);
    }

    Object.assign(showtime, updateDto);
    return await this.showtimesRepository.save(showtime);
  }

  async remove(id: number) {
    const showtime = await this.findOne(id);

    if (!showtime) {
      throw new NotFoundException(`Showtime with ${id} not found`);
    }
    return await this.showtimesRepository.remove(showtime);
  }
}
