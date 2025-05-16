import { Controller, Post, Body, Logger } from '@nestjs/common';
import { GeoService } from './geo.service';
import { ProcessRequestDto } from './dto/process-request.dto';
import { ProcessResponseDto } from './dto/process-response.dto';

@Controller('geo')
export class GeoController {
  private readonly logger = new Logger(GeoController.name);

  constructor(private readonly geoService: GeoService) {}

  @Post('process')
  async processPoints(
    @Body() processRequestDto: ProcessRequestDto,
  ): Promise<ProcessResponseDto> {
    this.logger.log(
      `Received request for /geo/process: ${processRequestDto.points.length} points`,
    );
    return this.geoService.processCoordinates(processRequestDto);
  }
}
