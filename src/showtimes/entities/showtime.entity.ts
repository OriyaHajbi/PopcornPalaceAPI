/* eslint-disable prettier/prettier */
import { Booking } from 'src/booking/entities/booking.entity';
import { Movie } from 'src/movies/entities/movie.entity';
import { Theater } from 'src/theater/entities/theater.entity';
// import { Booking } from '../../booking/entities/booking.entity';
// import { Movie } from '../../movies/entities/movie.entity';
// import { Theater } from '../../theater/entities/theater.entity';
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

  @Column('jsonb')
  seats: {
    seatNumber: number;
    isBooked: boolean;
    bookedBy?: string | null; // UUID of the user who booked
  }[];

  initializeSeatsFromTheater(theater: Theater) {
    if (!theater || typeof theater.seatsAmount !== 'number') {
      throw new Error('Invalid theater data provided');
    }

    this.seats = Array.from({ length: theater.seatsAmount }, (_, i) => ({
      seatNumber: i + 1,
      isBooked: false,
      bookedBy: null as string | null,
    }));
  }
}
