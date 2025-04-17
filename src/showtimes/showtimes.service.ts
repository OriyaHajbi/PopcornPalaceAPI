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
import { Theater } from 'src/theater/entities/theater.entity';

@Injectable()
export class ShowtimesService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimesRepository: Repository<Showtime>,
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
    @InjectRepository(Theater)
    private readonly theaterRepository: Repository<Theater>,
  ) {}

  async create(createShowtimeDto: CreateShowtimeDto) {
    const { movieId, theaterId, startTime, endTime, price } = createShowtimeDto;

    // here i need only the movie ID
    const movie = this.moviesRepository.create({ id: movieId });
    // here i need the full entity for the initializeSeatsFromTheater function
    const theater = await this.theaterRepository.findOne({
      where: { id: theaterId },
    });

    if (!movie || !theater) {
      throw new NotFoundException('Movie or Theater not found');
    }
    // Check for overlapping showtimes
    const overlappingShowtime = await this.showtimesRepository.findOne({
      where: {
        theater: { id: theaterId },
        movie: { id: movieId },
        startTime: LessThan(endTime),
        endTime: MoreThan(startTime),
      },
    });

    if (overlappingShowtime) {
      throw new ConflictException(
        `Overlapping showtime: There's already a show scheduled in this theater between ${overlappingShowtime.startTime.toISOString()} and ${overlappingShowtime.endTime.toISOString()}. Your requested time (${startTime.toISOString()} - ${endTime.toISOString()}) conflicts with it.`,
      );
    }

    const showtime = this.showtimesRepository.create({
      movie,
      theater,
      startTime,
      endTime,
      price,
    });

    showtime.initializeSeatsFromTheater(theater);

    const saved = await this.showtimesRepository.save(showtime);
    return {
      id: saved.id,
      price: saved.price,
      movieId: movie.id,
      theater: theater.name,
      startTime: saved.startTime,
      endTime: saved.endTime,
    };
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

  async update(id: number, updateDto: UpdateShowtimeDto) {
    const showtime = await this.showtimesRepository.findOne({ where: { id } });

    if (!showtime) {
      throw new NotFoundException(`Showtime with ID ${id} not found`);
    }

    Object.assign(showtime, updateDto);
    await this.showtimesRepository.save(showtime);
  }

  async remove(id: number) {
    const showtime = await this.findOne(id);

    if (!showtime) {
      throw new NotFoundException(`Showtime with ${id} not found`);
    }
    await this.showtimesRepository.remove(showtime);
  }
}
