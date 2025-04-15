/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';
import { TheatersService } from './theater.service';

@Controller('theaters')
export class TheatersController {
  constructor(private readonly theatersService: TheatersService) {}

  @Post()
  @HttpCode(200)
  create(@Body() createTheaterDto: CreateTheaterDto) {
    return this.theatersService.create(createTheaterDto);
  }

  @Get('all')
  @HttpCode(200)
  findAll() {
    return this.theatersService.findAll();
  }

  @Post('update/:name')
  @HttpCode(200)
  updateByName(
    @Param('name') name: string,
    @Body() updateTheaterDto: UpdateTheaterDto,
  ) {
    return this.theatersService.updateByName(name, updateTheaterDto);
  }

  @Delete(':name')
  @HttpCode(200)
  removeByName(@Param('name') name: string) {
    return this.theatersService.removeByName(name);
  }
}
