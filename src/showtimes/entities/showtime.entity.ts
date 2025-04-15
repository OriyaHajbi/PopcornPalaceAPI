/* eslint-disable prettier/prettier */
import { Movie } from 'src/movies/entities/movie.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'showtimes' })
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  theater: string; // Theater name

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column({ type: 'decimal' })
  price: number;

  @ManyToOne(() => Movie, (movie) => movie.showtimes, {
    onDelete: 'CASCADE', // Delete all showtimes when delete a movie
  })
  @JoinColumn({ name: 'movieId' })
  movie: Movie;
}
