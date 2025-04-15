/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesController } from './showtimes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Showtime } from './entities/showtime.entity';
import { Movie } from 'src/movies/entities/movie.entity';
import { Theater } from 'src/theater/entities/theater.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Showtime, Movie, Theater])],
  controllers: [ShowtimesController],
  providers: [ShowtimesService],
})
export class ShowtimesModule {}
