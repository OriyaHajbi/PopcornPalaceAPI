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
  start_time: Date;

  @Column()
  end_time: Date;

  @Column({ type: 'decimal' })
  price: number;

  @ManyToOne(() => Movie, (movie) => movie.showtimes)
  @JoinColumn({ name: 'movieId' })
  movie: Movie;
}
