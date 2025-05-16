import { Type } from 'class-transformer';
import {
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
  ArrayMinSize,
} from 'class-validator';
import { PointDto } from './point.dto';

export class ProcessRequestDto {
  @IsArray({ message: "The 'points' field must be an array." })
  @ArrayNotEmpty({ message: "The 'points' array cannot be empty." })
  @ArrayMinSize(1, {
    message: "The 'points' array must contain at least one point.",
  })
  @ValidateNested({
    each: true,
    message: "Each element in 'points' must be a valid Point object.",
  })
  @Type(() => PointDto)
  points: PointDto[];
}
