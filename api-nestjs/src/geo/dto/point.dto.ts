import { IsLatitude, IsLongitude, IsNotEmpty, IsNumber } from 'class-validator';

export class PointDto {
  @IsNotEmpty({ message: 'The latitude cannot be empty.' })
  @IsNumber({}, { message: 'The latitude must be a number.' })
  @IsLatitude({ message: 'The latitude must be a valid coordinate.' })
  lat: number;

  @IsNotEmpty({ message: 'The longitude cannot be empty.' })
  @IsNumber({}, { message: 'The longitude must be a number.' })
  @IsLongitude({ message: 'The longitude must be a valid coordinate.' })
  lng: number;
} 