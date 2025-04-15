/* eslint-disable prettier/prettier */
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsEndTimeAfterStartTime', async: false })
export class IsEndTimeAfterStartTimeConstraint
  implements ValidatorConstraintInterface
{
  validate(end_time: Date, args: ValidationArguments) {
    const start_time = (args.object as any).start_time; // Access start_time from the object
    if (start_time && end_time) {
      return end_time > start_time; // Ensure end_time is after start_time
    }
    return true; // If either is not provided, no validation error
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments): string {
    return 'End time must be after start time';
  }
}
