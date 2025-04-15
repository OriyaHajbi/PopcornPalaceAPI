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
  validate(endTime: Date, args: ValidationArguments) {
    const startTime = (args.object as any).startTime; // Access start_time from the object
    if (startTime && endTime) {
      return endTime > startTime; // Ensure end_time is after start_time
    }
    return true; // If either is not provided, no validation error
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments): string {
    return 'End time must be after start time';
  }
}
