/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Showtime } from 'src/showtimes/entities/showtime.entity';
// import { Showtime } from '../../showtimes/entities/showtime.entity';

import { User } from 'src/user/entities/user.entity';
// import { User } from '../../user/entities/user.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.tickets, { eager: true })
  user: User;

  @ManyToOne(() => Showtime, (showtime) => showtime.tickets, { eager: true })
  showtime: Showtime;

  //   @ManyToOne(() => Theater, (theater) => theater.tickets, { eager: true })
  //   theater: Theater;

  @Column()
  seatNumber: number;

  @CreateDateColumn()
  bookedAt: Date;
}
