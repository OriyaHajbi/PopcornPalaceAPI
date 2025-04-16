/* eslint-disable prettier/prettier */
import { Showtime } from 'src/showtimes/entities/showtime.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('theaters')
export class Theater {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  seatsAmount: number;

  // @Column('jsonb')
  // seats: {
  //   seatNumber: number;
  //   isBooked: boolean;
  //   bookedBy?: string | null; // UUID of the user who booked
  // }[];

  @OneToMany(() => Showtime, (showtime) => showtime.theater)
  showtimes: Showtime[];

  // @OneToMany(() => Booking, (booking) => booking.theater)
  // tickets: Booking[];

  // initializeSeats() {
  //   this.seats = Array.from({ length: this.seatsAmount }, (_, i) => ({
  //     seatNumber: i + 1,
  //     isBooked: false,
  //     bookedBy: null as string | null, // UUID will go here
  //   }));
  // }
}
