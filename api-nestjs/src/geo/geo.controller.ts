import { Controller, Post, Body, UseInterceptors, HttpCode } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { GeoService } from './geo.service';
import { ProcessRequestDto } from './dto/process-request.dto';
import { ProcessResponseDto } from './dto/process-response.dto';

@Controller('geo')
export class GeoController {
  constructor(private readonly geoService: GeoService) {}

  @Post('process')
  @HttpCode(200) // By default is 201 for POST, but we change it to 200
  @UseInterceptors(CacheInterceptor) // Use the NestJS cache interceptor
  async processPoints(@Body() processRequestDto: ProcessRequestDto): Promise<ProcessResponseDto> {
    return this.geoService.processCoordinates(processRequestDto);
  }
}
