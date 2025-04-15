/* eslint-disable prettier/prettier */
import { Booking } from 'src/booking/entities/booking.entity';
import { Movie } from 'src/movies/entities/movie.entity';
import { Theater } from 'src/theater/entities/theater.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'showtimes' })
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Theater, (theater) => theater.showtimes, {
    eager: true,
    onDelete: 'CASCADE',
  })
  theater: Theater;

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

  @OneToMany(() => Booking, (booking) => booking.showtime)
  tickets: Booking[];
}
