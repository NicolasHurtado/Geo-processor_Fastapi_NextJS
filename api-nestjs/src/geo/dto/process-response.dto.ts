import { CentroidDto } from './centroid.dto';
import { BoundsDto } from './bounds.dto';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class ProcessResponseDto {
  @ValidateNested()
  @Type(() => CentroidDto)
  centroid: CentroidDto;

  @ValidateNested()
  @Type(() => BoundsDto)
  bounds: BoundsDto;
} 