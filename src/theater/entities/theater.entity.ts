/* eslint-disable prettier/prettier */
import { Showtime } from 'src/showtimes/entities/showtime.entity';
// import { Showtime } from '../../showtimes/entities/showtime.entity';

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('theaters')
export class Theater {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  seatsAmount: number;

  @OneToMany(() => Showtime, (showtime) => showtime.theater)
  showtimes: Showtime[];
}
