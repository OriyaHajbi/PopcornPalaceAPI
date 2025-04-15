/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Post()
  @HttpCode(200)
  create(@Body() createShowtimeDto: CreateShowtimeDto) {
    return this.showtimesService.create(createShowtimeDto);
  }

  // @Get()
  // findAll() {
  //   return this.showtimesService.findAll();
  // }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id') id: string) {
    return this.showtimesService.findOne(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateShowtimeDto: UpdateShowtimeDto,
  // ) {
  //   return this.showtimesService.update(+id, updateShowtimeDto);
  // }
  @Post('update/:id')
  @HttpCode(200)
  updateShowtime(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateShowtimeDto: UpdateShowtimeDto,
  ) {
    this.showtimesService.update(id, updateShowtimeDto);
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id') id: string) {
    this.showtimesService.remove(+id);
  }
}
