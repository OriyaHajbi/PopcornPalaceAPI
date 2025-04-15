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
    // const movie = await this.moviesRepository.findOne({
    //   where: { id: movieId },
    // });
    const movie = this.moviesRepository.create({ id: movieId });

    // const theater = await this.theaterRepository.findOne({
    //   where: { id: theaterId },
    // });
    const theater = this.theaterRepository.create({ id: theaterId });

    console.log(movie);
    if (!movie || !theater) {
      throw new NotFoundException('Movie or Theater not found');
    }
    // need to add logic
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
      throw new ConflictException('There is an overlapping showtime');
    }

    const showtime = this.showtimesRepository.create({
      movie, // Movie entity, not just the movieId
      theater,
      startTime,
      endTime,
      price,
    });
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
