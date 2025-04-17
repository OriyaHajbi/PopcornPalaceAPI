/* eslint-disable prettier/prettier */
import { validate } from 'class-validator';
import { CreateBookingDto } from './dto/create-booking.dto';

describe('CreateBookingDto', () => {
  it('should validate userId as a valid UUID', async () => {
    const dto = new CreateBookingDto();
    dto.userId = 'invalid-uuid'; // Invalid UUID
    dto.showtimeId = 1;
    dto.seatNumber = 1;

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('userId');
    expect(errors[0].constraints).toHaveProperty('isUuid');
    expect(errors[0].constraints.isUuid).toBe('userId must be a UUID'); // This matches the actual validation message
  });

  it('should validate showtimeId as a positive integer', async () => {
    const dto = new CreateBookingDto();
    dto.userId = 'e4eaaaf2-d142-11e9-8f0b-1f0a4e0b8e32'; // Valid UUID
    dto.showtimeId = -1; // Invalid, should be positive
    dto.seatNumber = 1;

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('showtimeId');
    expect(errors[0].constraints).toHaveProperty('isPositive');
  });

  it('should validate seatNumber as a positive integer', async () => {
    const dto = new CreateBookingDto();
    dto.userId = 'e4eaaaf2-d142-11e9-8f0b-1f0a4e0b8e32'; // Valid UUID
    dto.showtimeId = 1;
    dto.seatNumber = -5; // Invalid, should be positive

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('seatNumber');
    expect(errors[0].constraints).toHaveProperty('isPositive');
  });

  it('should pass validation for valid data', async () => {
    const dto = new CreateBookingDto();
    dto.userId = 'e4eaaaf2-d142-11e9-8f0b-1f0a4e0b8e32'; // Valid UUID
    dto.showtimeId = 1;
    dto.seatNumber = 5;

    const errors = await validate(dto);

    expect(errors.length).toBe(0); // No validation errors should be present
  });
});
