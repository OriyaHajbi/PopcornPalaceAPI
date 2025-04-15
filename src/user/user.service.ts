/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto); // Create a new user instance
    return this.userRepository.save(user); // Save the new user to the database
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find(); // Return all users
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error(`User with id ${id} not found`); // Return an error if the user is not found
    }
    return user; // Return the user
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error(`User with id ${id} not found`); // Return an error if the user is not found
    }
    // Update the user fields with the new data
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user); // Save the updated user to the database
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error(`User with id ${id} not found`); // Return an error if the user is not found
    }
    await this.userRepository.remove(user); // Remove the user from the database
  }
}
